import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';

export class ProductUpdateDto {
    @ApiProperty({ example: 'Macbook Air', description: 'Title of the product' })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'MB-1230', description: 'Code of the product' })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    code: string;

    @ApiProperty({ example: 'Laptop', description: 'Category of the product' })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    category: string;

    @ApiProperty({ example: '200000', description: 'Buying price of the product' })
    @IsOptional()
    @IsNotEmpty()
    @IsNumberString()
    buyingPrice: number;

    @ApiProperty({ example: '250000', description: 'Selling price of the product' })
    @IsOptional()
    @IsNotEmpty()
    @IsNumberString()
    sellingPrice: number;

    @ApiProperty({ example: 'Product of the year', description: 'Description of the product' })
    @IsOptional()
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
