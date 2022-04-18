import { IsArray, IsNotEmpty, IsNumberString, IsString } from 'class-validator';

class ProductInfo {
    @IsNotEmpty({ message: 'Product id is required' })
    id: string;

    @IsNotEmpty({ message: 'Product quantity is required' })
    @IsNumberString({ message: 'Product quantity must be a number' })
    quantity: string;
}

export class OrderDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    number: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsArray()
    products: ProductInfo[];
}
