import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../category/schema';
import { ProductDto, ProductUpdateDto, VariantCreateDto, VariantUpdateDto } from './dto';
import { FilterQuery } from './interfaces';
import { Product, ProductDocument } from './schema';
import { StorageService } from './utils';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
        @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>,
        private readonly storageService: StorageService
    ) {}

    async create(userId: string, dto: ProductDto, image: Express.Multer.File): Promise<Product> {
        const product = await this.productModel.findOne({ merchantId: userId, code: dto.code });
        if (product) {
            throw new ForbiddenException('product code already exists');
        }

        const category = await this.categoryModel.findOne({
            merchantId: userId,
            name: dto.category,
        });
        if (!category) {
            throw new ForbiddenException('category does not exist');
        }

        if (!image) {
            throw new ForbiddenException('Product thumbnail image is required');
        }

        // upload image
        const { location, key } = await this.storageService.uploadFile(image);

        const newProduct = new this.productModel({
            ...dto,
            merchantId: userId,
            thumbImage: location,
            thumbImageKey: key,
        });

        await newProduct.save();

        return newProduct;
    }

    async findAll(
        userId: string,
        page: number,
        size: number,
        filterQuery: FilterQuery
    ): Promise<Product[]> {
        Object.keys(filterQuery).forEach((key) => {
            // if any filter query option is empty, remove it from filter query
            if (
                filterQuery[key] === '' ||
                filterQuery[key] === null ||
                filterQuery[key] === undefined
            ) {
                delete filterQuery[key];
            } else if (key === 'startDate') {
                // if filter query option has startDate, convert this to Date object according to mongodb format
                filterQuery.updatedAt = {
                    ...filterQuery.updatedAt,
                    $gte: new Date(filterQuery.startDate),
                };
            } else if (key === 'endDate') {
                // if filter query option has endDate, convert this to Date object according to mongodb format
                filterQuery.updatedAt = {
                    ...filterQuery.updatedAt,
                    $lte: new Date(filterQuery.endDate),
                };
            }
        });

        return await this.productModel
            .find({ ...filterQuery, merchantId: userId })
            .limit(size)
            .skip((page - 1) * size);
    }

    async findOne(userId: string, productId: string): Promise<Product> {
        return await this.productModel.findOne({ merchantId: userId, _id: productId });
    }

    async update(
        userId: string,
        productId: string,
        dto: ProductUpdateDto,
        image: Express.Multer.File
    ): Promise<Product> {
        const product = await this.productModel.findOne({ merchantId: userId, _id: productId });
        if (!product) {
            throw new ForbiddenException('product does not exist');
        }

        if (dto.category) {
            const category = await this.categoryModel.findOne({
                merchantId: userId,
                name: dto.category,
            });
            if (!category) {
                throw new ForbiddenException('category does not exist');
            }
        }

        if (image) {
            // delete old image first
            await this.storageService.deleteFile(product.thumbImageKey);

            // upload new image
            const { location, key } = await this.storageService.uploadFile(image);

            (dto as any).thumbImage = location;
            (dto as any).thumbImageKey = key;
        }

        return await this.productModel.findByIdAndUpdate(productId, dto, { new: true });
    }

    async delete(userId: string, productId: string): Promise<Product> {
        const product = await this.productModel.findOne({ merchantId: userId, _id: productId });
        if (!product) {
            throw new ForbiddenException('product does not exist');
        }

        // delete product thumbnail image
        await this.storageService.deleteFile(product.thumbImageKey);

        // delete product variants image
        for (const variant of product.variants) {
            await this.storageService.deleteFile(variant.variantImageKey);
        }

        // reduce stock on category by the total shock of this product variants
        const category = await this.categoryModel.findOne({
            merchantId: userId,
            name: product.category,
        });
        const productStock = product.variants.reduce((prev, curr) => prev + curr.stock, 0);
        category.stock -= productStock;
        await category.save();

        // delete product
        await product.remove();

        return product;
    }

    async addVariant(
        userId: string,
        productId: string,
        dto: VariantCreateDto,
        image: Express.Multer.File
    ): Promise<Product> {
        const product = await this.productModel.findOne({ merchantId: userId, _id: productId });
        if (!product) {
            throw new ForbiddenException('product does not exist');
        }

        for (const variant of product.variants) {
            if (variant.variantCode === dto.variantCode) {
                throw new ForbiddenException('variant code already exists');
            }
        }

        if (!image) {
            throw new ForbiddenException('Product image is required');
        }

        // upload image
        const { location, key } = await this.storageService.uploadFile(image);

        product.variants.push({
            ...dto,
            variantImage: location,
            variantImageKey: key,
        });

        // increase stock on product
        product.stock += dto.stock;

        await product.save();

        // increase stock on category by this variant's stock
        const category = await this.categoryModel.findOne({
            merchantId: userId,
            name: product.category,
        });
        category.stock += dto.stock;
        await category.save();

        return product;
    }

    async updateVariant(
        userId: string,
        productId: string,
        variantId: string,
        dto: VariantUpdateDto,
        image: Express.Multer.File
    ): Promise<Product> {
        const product = await this.productModel.findOne({ merchantId: userId, _id: productId });
        if (!product) {
            throw new ForbiddenException('product does not exist');
        }

        const variantIndex = product.variants.findIndex(
            (v) => (v as any)._id.toString() == variantId
        );
        if (variantIndex < 0) {
            throw new ForbiddenException('variant does not exist');
        }

        let variant = product.variants[variantIndex];

        if (image) {
            // delete old image first
            await this.storageService.deleteFile(variant.variantImageKey);

            // upload new image
            const { location, key } = await this.storageService.uploadFile(image);

            (dto as any).variantImage = location;
            (dto as any).variantImageKey = key;
        }

        // update stock on product
        product.stock -= variant.stock;
        product.stock += dto.stock;

        // update stock on category
        const category = await this.categoryModel.findOne({
            merchantId: userId,
            name: product.category,
        });
        category.stock -= variant.stock;
        category.stock += dto.stock;
        await category.save();

        variant = { ...variant, ...dto };
        product.variants[variantIndex] = variant;

        await product.save();

        return product;
    }

    async deleteVariant(userId: string, productId: string, variantId: string): Promise<Product> {
        const product = await this.productModel.findOne({ merchantId: userId, _id: productId });
        if (!product) {
            throw new ForbiddenException('product does not exist');
        }

        const variantIndex = product.variants.findIndex(
            (v) => (v as any)._id.toString() == variantId
        );
        if (variantIndex < 0) {
            throw new ForbiddenException('variant does not exist');
        }

        // delete variant image
        await this.storageService.deleteFile(product.variants[variantIndex].variantImageKey);

        // reduce stock on product
        product.stock -= product.variants[variantIndex].stock;

        // reduce stock on category by this variant's stock
        const category = await this.categoryModel.findOne({
            merchantId: userId,
            name: product.category,
        });
        category.stock -= product.variants[variantIndex].stock;
        await category.save();

        // delete variant
        product.variants.splice(variantIndex, 1);

        await product.save();

        return product;
    }
}
