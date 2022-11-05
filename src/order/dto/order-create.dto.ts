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

class ProductInformation {
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

export class OrderCreateDto {
    @ApiProperty({ example: 'Tanvir Hossain', description: 'Customer name' })
    @IsNotEmpty()
    @IsString()
    customerName: string;

    @ApiProperty({ example: '01325478641', description: 'Customer mobile number' })
    @IsNotEmpty()
    @IsString()
    customerNumber: string;

    @ApiProperty({ example: 'Dhaka', description: 'Delivery city' })
    @IsNotEmpty()
    @IsString()
    city: string;

    @ApiProperty({ example: 'Sector - 10', description: 'Delivery zone' })
    @IsNotEmpty()
    @IsString()
    zone: string;

    @ApiProperty({ example: 'Mogher mulluk', description: 'Delivery area' })
    @IsNotEmpty()
    @IsString()
    area: string;

    @ApiProperty({ example: 'Uttara', description: 'Delivery address' })
    @IsNotEmpty()
    @IsString()
    address: string;

    @ApiProperty({
        example: 'Abar ashben',
        description: 'Special message for the customer',
        required: false,
    })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    specialMessage: string;

    @ApiProperty({
        example: '99.99',
        description: 'Discount on the total of the order(in percentage)',
        required: false,
    })
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    discount: number;

    @ApiProperty({ example: '5', description: 'Advanced payment for the order', required: false })
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    advancedPayment: number;

    @ApiProperty({ type: ProductInformation, isArray: true })
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
    @Type(() => ProductInformation)
    products: ProductInformation[];
}
