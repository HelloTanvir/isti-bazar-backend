import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    // eslint-disable-next-line prettier/prettier
    ApiTags
} from '@nestjs/swagger';
import { GetCurrentUser } from '../common/decorators';
import { CategoryService } from './category.service';
import { CategoryDto, CategoryUpdateDto } from './dto';
import { Category } from './schema';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a category' })
    @ApiCreatedResponse({ type: Category })
    @ApiBearerAuth()
    create(@GetCurrentUser('userId') userId: string, @Body() dto: CategoryDto): Promise<Category> {
        return this.categoryService.create(userId, dto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Gel all categories' })
    @ApiOkResponse({ type: [Category] })
    findAll(@GetCurrentUser('userId') userId: string): Promise<Category[]> {
        return this.categoryService.findAll(userId);
    }

    @Get('/:categoryId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Gel a single category' })
    @ApiOkResponse({ type: Category })
    findOne(
        @GetCurrentUser('userId') userId: string,
        @Param('categoryId') categoryId: string
    ): Promise<Category> {
        return this.categoryService.findOne(userId, categoryId);
    }

    @Post('/:categoryId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update a category' })
    @ApiOkResponse({ type: Category })
    @ApiBearerAuth()
    update(
        @GetCurrentUser('userId') userId: string,
        @Param('categoryId') categoryId: string,
        @Body() dto: CategoryUpdateDto
    ): Promise<Category> {
        return this.categoryService.update(userId, categoryId, dto);
    }

    @Delete('/:categoryId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete a category' })
    @ApiOkResponse({ type: Category })
    @ApiBearerAuth()
    delete(
        @GetCurrentUser('userId') userId: string,
        @Param('categoryId') categoryId: string
    ): Promise<Category> {
        return this.categoryService.delete(userId, categoryId);
    }
}
