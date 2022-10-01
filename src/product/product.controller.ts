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
import { GetCurrentUser } from '../common/decorators';
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
    create(
        @GetCurrentUser('userId') userId: string,
        @Body() dto: ProductDto,
        @UploadedFile() image: Express.Multer.File
    ): Promise<Product> {
        return this.productService.create(userId, dto, image);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get all products' })
    @ApiOkResponse({ type: [Product], isArray: true })
    findAll(@GetCurrentUser('userId') userId: string): Promise<Product[]> {
        return this.productService.findAll(userId);
    }

    @Get('/:productId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get a single product' })
    @ApiOkResponse({ type: Product })
    findOne(
        @GetCurrentUser('userId') userId: string,
        @Param('productId') productId: string
    ): Promise<Product> {
        return this.productService.findOne(userId, productId);
    }

    @Post('/:productId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update a product' })
    @ApiOkResponse({ type: Product })
    @ApiBearerAuth()
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(FilesInterceptor('thumbImage', 1, imageUploadOptions))
    update(
        @GetCurrentUser('userId') userId: string,
        @Param('productId') productId: string,
        @Body() dto: ProductUpdateDto,
        @UploadedFiles() image: Express.Multer.File
    ): Promise<Product> {
        return this.productService.update(userId, productId, dto, image);
    }

    @Delete('/:productId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete a product' })
    @ApiOkResponse({ type: Product })
    @ApiBearerAuth()
    delete(
        @GetCurrentUser('userId') userId: string,
        @Param('productId') productId: string
    ): Promise<Product> {
        return this.productService.delete(userId, productId);
    }

    // TODO: create a route to add product variant with image
    // TODO: add admin access to product
}
