import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CategoryUpdateDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    stock: number;
}
