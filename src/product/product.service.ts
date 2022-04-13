import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schema';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private readonly categoryModel: Model<ProductDocument>
    ) {}
}
