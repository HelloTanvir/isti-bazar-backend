import { Type } from 'class-transformer';
import {
    IsArray,
    IsNotEmpty,
    IsNumberString,
    IsOptional,
    IsString,
    // eslint-disable-next-line prettier/prettier
    ValidateNested
} from 'class-validator';

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
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductInfo)
    products: ProductInfo[];

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    status: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    address: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    city: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    zone: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    deliveryTime: string;

    @IsOptional()
    @IsNotEmpty()
    @IsNumberString()
    total: string;
}
