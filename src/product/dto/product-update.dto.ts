import { IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';

export class ProductUpdateDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    code: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    category: string;

    @IsOptional()
    @IsNotEmpty()
    @IsNumberString()
    price: number;

    @IsOptional()
    @IsNotEmpty()
    @IsNumberString()
    stock: number;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    size: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    color: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    description: string;
}
