import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    IsArray,
    IsNotEmpty,
    IsNumberString,
    IsOptional,
    IsString,
    // eslint-disable-next-line prettier/prettier
    ValidateNested
} from 'class-validator';

class Variant {
    @ApiProperty({ example: 'Small', description: 'Size of the variant' })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    size: string;

    @ApiProperty({ example: 'Black', description: 'Color of the variant' })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    color: string;

    @ApiProperty({ example: 'Small', description: 'Size of the variant' })
    @IsOptional()
    @IsNotEmpty()
    @IsNumberString({ message: 'Variant stock must be a number' })
    stock: number;
}

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

    @ApiProperty({ example: '25', description: 'Stock of the product' })
    @IsOptional()
    @IsNotEmpty()
    @IsNumberString()
    stock: number;

    @ApiProperty({ example: 'Product of the year', description: 'Description of the product' })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({
        type: [Variant],
        isArray: true,
        example: [
            {
                size: 'Small',
                color: 'Silver',
                stock: 10,
            },
        ],
    })
    @IsOptional()
    @IsNotEmpty()
    @Transform(
        ({ value }) => {
            if (value && typeof value === 'string') {
                return JSON.parse(value);
            } else if (value && typeof value === 'object') {
                return value;
            }
            return [];
        },
        { toClassOnly: true }
    )
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Variant)
    variants: Variant[];
}
