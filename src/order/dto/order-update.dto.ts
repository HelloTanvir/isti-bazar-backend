import { IsArray, IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';

class ProductInfo {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsOptional()
    @IsNotEmpty({ message: 'Product quantity is required' })
    @IsNumberString({ message: 'Product quantity must be a number' })
    quantity: string;
}

export class OrderUpdateDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    number: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    address: string;

    @IsOptional()
    @IsNotEmpty()
    @IsArray()
    products: ProductInfo[];

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    status: string;
}
