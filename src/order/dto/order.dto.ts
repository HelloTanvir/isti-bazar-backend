import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsString,
    // eslint-disable-next-line prettier/prettier
    ValidateNested
} from 'class-validator';

class ProductInfo {
    @ApiProperty({ example: 'r46frf1f6f46ef1', description: 'Ordered product id' })
    @IsNotEmpty()
    @IsString()
    productId: string;

    @ApiProperty({ example: 'r46frf1f6f46ef1', description: 'Ordered product id' })
    @IsNotEmpty()
    @IsString()
    variantId: string;

    @ApiProperty({ example: 10, description: 'Quantity of the ordered product' })
    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}

export class OrderDto {
    @ApiProperty({ example: 'Tanvir Hossain', description: 'Customer name' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: '01325478641', description: 'Customer mobile number' })
    @IsNotEmpty()
    @IsString()
    number: string;

    @ApiProperty({ type: [ProductInfo] })
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
    @Type(() => ProductInfo)
    products: ProductInfo[];

    @ApiProperty({ example: 'Uttara', description: 'Delivery address' })
    @IsNotEmpty()
    @IsString()
    address: string;

    @ApiProperty({ example: 'Dhaka', description: 'Delivery city' })
    @IsNotEmpty()
    @IsString()
    city: string;

    @ApiProperty({ example: 'Sector - 10', description: 'Delivery zone' })
    @IsNotEmpty()
    @IsString()
    zone: string;
}
