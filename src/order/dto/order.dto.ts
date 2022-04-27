import { IsArray, IsNotEmpty, IsNumberString, IsString } from 'class-validator';

class ProductInfo {
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
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
    @IsArray()
    products: ProductInfo[];

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsString()
    city: string;

    @IsNotEmpty()
    @IsString()
    zone: string;

    @IsNotEmpty()
    @IsString()
    deliveryTime: string;

    @IsNotEmpty()
    @IsNumberString()
    total: string;
}
