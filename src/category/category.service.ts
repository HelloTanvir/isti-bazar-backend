import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryDto, CategoryUpdateDto } from './dto';
import { Category, CategoryDocument } from './schema';

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>
    ) {}

    async create(userId: string, dto: CategoryDto): Promise<Category> {
        const category = await this.categoryModel.findOne({ merchantId: userId, name: dto.name });
        if (category) {
            throw new ForbiddenException('category already exists');
        }

        const newCategory = new this.categoryModel({
            ...dto,
            merchantId: userId,
        });
        await newCategory.save();

        return newCategory;
    }

    async findAll(userId: string, page: number, size: number): Promise<Category[]> {
        return await this.categoryModel
            .find({ merchantId: userId })
            .limit(size)
            .skip((page - 1) * size);
    }

    async findOne(userId: string, categoryId: string): Promise<Category> {
        return await this.categoryModel.findOne({ merchantId: userId, _id: categoryId });
    }

    async update(userId: string, categoryId: string, dto: CategoryUpdateDto): Promise<Category> {
        const category = await this.categoryModel.findOne({ merchantId: userId, _id: categoryId });
        if (!category) {
            throw new ForbiddenException('category does not exist');
        }

        return await this.categoryModel.findByIdAndUpdate(categoryId, dto, { new: true });
    }

    async delete(userId: string, categoryId: string): Promise<Category> {
        const category = await this.categoryModel.findOne({ merchantId: userId, _id: categoryId });
        if (!category) {
            throw new ForbiddenException('category does not exist');
        }

        await category.remove();

        return category;
    }
}
