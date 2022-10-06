import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';

export class VariantUpdateDto {
    @ApiProperty({ example: 'ABC-123', description: 'Code of the variant', required: false })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    variantCode: string;

    @ApiProperty({
        example: ['m', 'l', 'xl'],
        description: 'Sizes of the variant',
        required: false,
        isArray: true,
        type: 'string',
    })
    @IsOptional()
    @IsNotEmpty()
    @IsArray()
    sizes: string[];

    @ApiProperty({ example: 'Black', description: 'Color of the variant', required: false })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    color: string;

    @ApiProperty({ example: 20, description: 'Stock of the variant', required: false })
    @IsOptional()
    @IsNotEmpty()
    @IsNumberString({ message: 'Variant stock must be a number' })
    stock: number;

    @ApiProperty({
        description: 'Image of the product variant',
        type: 'string',
        format: 'binary',
        required: false,
    })
    variantImage: string;
}
