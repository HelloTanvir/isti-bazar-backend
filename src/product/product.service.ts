import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../category/schema';
import { ProductDto } from './dto';
import { Product, ProductDocument } from './schema';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
        @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>
    ) {}

    async create(dto: ProductDto, images: Express.Multer.File[]): Promise<Product> {
        if (!images.length) {
            throw new ForbiddenException('Product images are required');
        }

        const product = await this.productModel.findOne({ code: dto.code });
        if (product) {
            throw new ForbiddenException('product code already exists');
        }

        const category = await this.categoryModel.findOne({ name: dto.category });
        if (!category) {
            throw new ForbiddenException('category does not exist');
        }

        const imagePaths = images.map((image) => image.path);

        const newProduct = new this.productModel({
            ...dto,
            images: imagePaths,
        });

        await newProduct.save();

        return newProduct;
    }

    async findAll(): Promise<Product[]> {
        return await this.productModel.find();
    }
}
