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
import { ProductDto, ProductUpdateDto, VariantCreateDto, VariantUpdateDto } from './dto';
import { ProductService } from './product.service';
import { Product } from './schema';
import { HttpExceptionFilter, imageUploadOptions } from './utils';

@ApiTags('Products')
@Controller('products')
export class ProductController {
    constructor(private productService: ProductService) {}

    // create a product with thumb image, no variant is added initially
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

    // get all products added by a merchant
    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get all products' })
    @ApiOkResponse({ type: [Product], isArray: true })
    findAll(@GetCurrentUser('userId') userId: string): Promise<Product[]> {
        return this.productService.findAll(userId);
    }

    // get a product by id added by a merchant
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

    // update a product
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

    // delete a product
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

    // add a variant to a product with variant image
    @Post('/:productId/variant')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Add a product variant' })
    @ApiCreatedResponse({ type: Product })
    @ApiBearerAuth()
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(FilesInterceptor('variantImage', 1, imageUploadOptions))
    addVariant(
        @GetCurrentUser('userId') userId: string,
        @Param('productId') productId: string,
        @Body() dto: VariantCreateDto,
        @UploadedFiles() image: Express.Multer.File
    ): Promise<Product> {
        return this.productService.addVariant(userId, productId, dto, image);
    }

    // update a variant of a product
    @Post('/:productId/variant/:variantId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update a product variant' })
    @ApiOkResponse({ type: Product })
    @ApiBearerAuth()
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(FilesInterceptor('variantImage', 1, imageUploadOptions))
    updateVariant(
        @GetCurrentUser('userId') userId: string,
        @Param('productId') productId: string,
        @Param('variantId') variantId: string,
        @Body() dto: VariantUpdateDto,
        @UploadedFiles() image: Express.Multer.File
    ): Promise<Product> {
        return this.productService.updateVariant(userId, productId, variantId, dto, image);
    }

    // TODO: create a route to update product variant with image
    // TODO: create a route to delete product variant with image deletion
    // TODO: add admin access to product
}
