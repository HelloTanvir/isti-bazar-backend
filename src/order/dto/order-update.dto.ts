import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    // eslint-disable-next-line prettier/prettier
    ValidateNested
} from 'class-validator';

class ProductInfo {
    @ApiProperty({ example: 'r46frf1f6f46ef1', description: 'Ordered product id' })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    productId: string;

    @ApiProperty({ example: 'r46frf1f6f46ef1', description: 'Ordered product id' })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    variantId: string;

    @ApiProperty({ example: 10, description: 'Quantity of the ordered product' })
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}

export class OrderUpdateDto {
    @ApiProperty({ example: 'Tanvir Hossain', description: 'Customer name' })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: '01325478641', description: 'Customer mobile number' })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    number: string;

    @ApiProperty({ type: [ProductInfo] })
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
    @Type(() => ProductInfo)
    products: ProductInfo[];

    @ApiProperty({ example: 'Uttara', description: 'Delivery address' })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    address: string;

    @ApiProperty({ example: 'Dhaka', description: 'Delivery city' })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    city: string;

    @ApiProperty({ example: 'Sector - 10', description: 'Delivery zone' })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    zone: string;

    @ApiProperty({ example: 'Delivered', description: 'Status of the order' })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    status: string;
}
