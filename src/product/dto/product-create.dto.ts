import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class ProductDto {
    @ApiProperty({ example: 'Macbook Air', description: 'Title of the product' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'MB-1230', description: 'Code of the product' })
    @IsNotEmpty()
    @IsString()
    code: string;

    @ApiProperty({ example: 'Laptop', description: 'Category of the product' })
    @IsNotEmpty()
    @IsString()
    category: string;

    @ApiProperty({ example: '200000', description: 'Buying price of the product' })
    @IsNotEmpty()
    @IsNumberString()
    buyingPrice: number;

    @ApiProperty({ example: '250000', description: 'Selling price of the product' })
    @IsNotEmpty()
    @IsNumberString()
    sellingPrice: number;

    @ApiProperty({ example: 'Product of the year', description: 'Description of the product' })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({
        description: 'Thumbnail image of the product',
        type: 'string',
        format: 'binary',
    })
    thumbImage: string;
}
