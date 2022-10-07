import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class OrderUpdateDto {
    @ApiProperty({
        example: 'Delivered',
        description: 'Status of the order',
        enum: ['Pending', 'Delivered', 'Canceled'],
    })
    @IsNotEmpty()
    @IsString()
    status: string;
}
