import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto';
import { Category } from './schema';

@Controller('categories')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() dto: CategoryDto): Promise<Category> {
        return this.categoryService.create(dto);
    }
}
