import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryDto } from './dto';
import { Category, CategoryDocument } from './schema';

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>
    ) {}

    async create(dto: CategoryDto): Promise<Category> {
        const category = new this.categoryModel(dto);

        await category.save();

        return category;
    }

    async findAll(): Promise<Category[]> {
        return await this.categoryModel.find();
    }
}
