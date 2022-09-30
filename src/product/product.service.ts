import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../category/schema';
import { ProductDto, ProductUpdateDto } from './dto';
import { Product, ProductDocument } from './schema';
import { StorageService } from './utils';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
        @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>,
        private readonly storageService: StorageService
    ) {}

    async create(dto: ProductDto, image: Express.Multer.File): Promise<Product> {
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

        // TODO: calculate product stock and update category stock

        const newProduct = new this.productModel({
            ...dto,
            thumbImage: location,
            thumbKey: key,
        });

        await newProduct.save();

        return newProduct;
    }

    async findAll(): Promise<Product[]> {
        return await this.productModel.find();
    }

    async findOne(id: string | number): Promise<Product> {
        return await this.productModel.findById(id);
    }

    async update(
        id: string | number,
        dto: ProductUpdateDto,
        image: Express.Multer.File
    ): Promise<Product> {
        const product = await this.productModel.findById(id);
        if (!product) {
            throw new ForbiddenException('product does not exist');
        }

        if (dto.category) {
            const category = await this.categoryModel.findOne({ name: dto.category });
            if (!category) {
                throw new ForbiddenException('category does not exist');
            }

            // TODO: calculate product stock and update category stock
        }

        if (image) {
            // delete old image first
            await this.storageService.deleteFile(product.thumbImageKey);

            // upload new image
            const { location, key } = await this.storageService.uploadFile(image);

            (dto as any).thumbImage = location;
            (dto as any).thumbImageKey = key;
        }

        return await this.productModel.findByIdAndUpdate(id, dto, { new: true });
    }

    async delete(id: string | number): Promise<Product> {
        const product = await this.productModel.findById(id);
        if (!product) {
            throw new ForbiddenException('product does not exist');
        }

        // delete product thumbnail image
        await this.storageService.deleteFile(product.thumbImageKey);

        // delete product
        await product.remove();

        return product;
    }
}
