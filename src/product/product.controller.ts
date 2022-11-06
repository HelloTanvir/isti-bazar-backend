import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Query,
    UploadedFile,
    UseFilters,
    // eslint-disable-next-line prettier/prettier
    UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiBearerAuth,
    ApiConsumes,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    // eslint-disable-next-line prettier/prettier
    ApiTags
} from '@nestjs/swagger';
import { GetCurrentUser } from '../common/decorators';
import { ProductDto, ProductUpdateDto, VariantCreateDto, VariantUpdateDto } from './dto';
import { FilterQuery } from './interfaces';
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
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Create a product' })
    @ApiCreatedResponse({ type: Product })
    @ApiBearerAuth()
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(FileInterceptor('thumbImage', imageUploadOptions))
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
    findAll(
        @GetCurrentUser('userId') userId: string,
        @Query('page', new DefaultValuePipe(1), new ParseIntPipe()) page: number,
        @Query('size', new DefaultValuePipe(10), new ParseIntPipe()) size: number,
        @Query('name') name: string,
        @Query('category') category: string,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string
    ): Promise<Product[]> {
        const filterQuery: FilterQuery = {
            name,
            category,
            startDate,
            endDate,
        };

        return this.productService.findAll(userId, page, size, filterQuery);
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
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Update a product' })
    @ApiOkResponse({ type: Product })
    @ApiBearerAuth()
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(FileInterceptor('thumbImage', imageUploadOptions))
    update(
        @GetCurrentUser('userId') userId: string,
        @Param('productId') productId: string,
        @Body() dto: ProductUpdateDto,
        @UploadedFile() image: Express.Multer.File
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
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Add a product variant' })
    @ApiCreatedResponse({ type: Product })
    @ApiBearerAuth()
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(FileInterceptor('variantImage', imageUploadOptions))
    addVariant(
        @GetCurrentUser('userId') userId: string,
        @Param('productId') productId: string,
        @Body() dto: VariantCreateDto,
        @UploadedFile() image: Express.Multer.File
    ): Promise<Product> {
        return this.productService.addVariant(userId, productId, dto, image);
    }

    // update a variant of a product
    @Post('/:productId/variant/:variantId')
    @HttpCode(HttpStatus.OK)
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Update a product variant' })
    @ApiOkResponse({ type: Product })
    @ApiBearerAuth()
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(FileInterceptor('variantImage', imageUploadOptions))
    updateVariant(
        @GetCurrentUser('userId') userId: string,
        @Param('productId') productId: string,
        @Param('variantId') variantId: string,
        @Body() dto: VariantUpdateDto,
        @UploadedFile() image: Express.Multer.File
    ): Promise<Product> {
        return this.productService.updateVariant(userId, productId, variantId, dto, image);
    }

    // delete a variant of a product
    @Delete('/:productId/variant/:variantId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete a product variant' })
    @ApiOkResponse({ type: Product })
    @ApiBearerAuth()
    deleteVariant(
        @GetCurrentUser('userId') userId: string,
        @Param('productId') productId: string,
        @Param('variantId') variantId: string
    ): Promise<Product> {
        return this.productService.deleteVariant(userId, productId, variantId);
    }
}
