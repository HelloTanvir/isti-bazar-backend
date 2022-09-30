import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    // eslint-disable-next-line prettier/prettier
    ApiTags
} from '@nestjs/swagger';
import { Public } from '../common/decorators';
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
    create(@Body() dto: CategoryDto): Promise<Category> {
        return this.categoryService.create(dto);
    }

    @Public()
    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Gel all categories' })
    @ApiOkResponse({ type: [Category] })
    findAll(): Promise<Category[]> {
        return this.categoryService.findAll();
    }

    @Public()
    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Gel a single category' })
    @ApiOkResponse({ type: Category })
    findOne(@Param('id') id: string | number): Promise<Category> {
        return this.categoryService.findOne(id);
    }

    @Post('/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update a category' })
    @ApiOkResponse({ type: Category })
    @ApiBearerAuth()
    update(@Param('id') id: string | number, @Body() dto: CategoryUpdateDto): Promise<Category> {
        return this.categoryService.update(id, dto);
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete a category' })
    @ApiOkResponse({ type: Category })
    @ApiBearerAuth()
    delete(@Param('id') id: string | number): Promise<Category> {
        return this.categoryService.delete(id);
    }
}
