import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDto } from './dto';
import { Product, ProductDocument } from './schema';

@Injectable()
export class ProductService {
    constructor(@InjectModel(Product.name) private readonly productModel: Model<ProductDocument>) {}

    async create(dto: ProductDto, images: Express.Multer.File[]): Promise<Product> {
        if (!images.length) {
            throw new ForbiddenException('Product images are required');
        }

        const imagePaths = images.map((image) => image.path);

        const product = new this.productModel({
            ...dto,
            images: imagePaths,
        });

        return product;
    }
}
