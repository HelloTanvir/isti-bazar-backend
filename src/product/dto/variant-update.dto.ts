import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';

export class VariantUpdateDto {
    @ApiProperty({ example: 'ABC-123', description: 'Code of the variant' })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    variantCode: string;

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

    @ApiProperty({ example: 20, description: 'Stock of the variant' })
    @IsOptional()
    @IsNotEmpty()
    @IsNumberString({ message: 'Variant stock must be a number' })
    stock: number;
}
