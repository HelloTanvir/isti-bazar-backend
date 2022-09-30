import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    UploadedFile,
    UploadedFiles,
    UseFilters,
    // eslint-disable-next-line prettier/prettier
    UseInterceptors
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    // eslint-disable-next-line prettier/prettier
    ApiTags
} from '@nestjs/swagger';
import { ProductDto, ProductUpdateDto } from './dto';
import { ProductService } from './product.service';
import { Product } from './schema';
import { HttpExceptionFilter, imageUploadOptions } from './utils';

@ApiTags('Products')
@Controller('products')
export class ProductController {
    constructor(private productService: ProductService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a product' })
    @ApiCreatedResponse({ type: Product })
    @ApiBearerAuth()
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(FilesInterceptor('thumbImage', 1, imageUploadOptions))
    create(@Body() dto: ProductDto, @UploadedFile() image: Express.Multer.File): Promise<Product> {
        return this.productService.create(dto, image);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get all products' })
    @ApiOkResponse({ type: [Product], isArray: true })
    findAll(): Promise<Product[]> {
        return this.productService.findAll();
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get a single product' })
    @ApiOkResponse({ type: Product })
    findOne(@Param('id') id: string | number): Promise<Product> {
        return this.productService.findOne(id);
    }

    @Post('/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update a product' })
    @ApiOkResponse({ type: Product })
    @ApiBearerAuth()
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(FilesInterceptor('thumbImage', 1, imageUploadOptions))
    update(
        @Param('id') id: string | number,
        @Body() dto: ProductUpdateDto,
        @UploadedFiles() image: Express.Multer.File
    ): Promise<Product> {
        return this.productService.update(id, dto, image);
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete a product' })
    @ApiOkResponse({ type: Product })
    @ApiBearerAuth()
    delete(@Param('id') id: string | number): Promise<Product> {
        return this.productService.delete(id);
    }

    // TODO: create a route to add product variant with image
}
