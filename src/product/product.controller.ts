import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UploadedFiles,
    // eslint-disable-next-line prettier/prettier
    UseInterceptors
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductDto } from './dto';
import { ProductService } from './product.service';
import { Product } from './schema';
import { imageUploadOptions } from './utils';

@Controller('products')
export class ProductController {
    constructor(private productService: ProductService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FilesInterceptor('images', 5, imageUploadOptions))
    create(
        @Body() dto: ProductDto,
        @UploadedFiles() images: Array<Express.Multer.File>
    ): Promise<Product> {
        return this.productService.create(dto, images);
    }
}
