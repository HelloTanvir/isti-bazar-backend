import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../category/schema';
import { ProductDto, ProductUpdateDto, VariantCreateDto, VariantUpdateDto } from './dto';
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
        const product = await this.productModel.findOne({ code: dto.code });
        if (product) {
            throw new ForbiddenException('product code already exists');
        }

        const category = await this.categoryModel.findOne({ name: dto.category });
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
            thumbKey: key,
        });

        await newProduct.save();

        return newProduct;
    }

    async findAll(userId: string): Promise<Product[]> {
        return await this.productModel.find({ merchantId: userId });
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
            const category = await this.categoryModel.findOne({ name: dto.category });
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

        // reduce stock on category by the total shock of this product variants
        const category = await this.categoryModel.findOne({ name: product.category });
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

        await product.save();

        // increase stock on category by this variant's stock
        const category = await this.categoryModel.findOne({ name: product.category });
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

        // update stock on category
        const category = await this.categoryModel.findOne({ name: product.category });
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

        // reduce stock on category by this variant's stock
        const category = await this.categoryModel.findOne({ name: product.category });
        category.stock -= product.variants[variantIndex].stock;
        await category.save();

        // delete variant
        product.variants.splice(variantIndex, 1);

        await product.save();

        return product;
    }
}
