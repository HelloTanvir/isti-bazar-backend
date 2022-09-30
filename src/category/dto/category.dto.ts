import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CategoryDto {
    @ApiProperty({ example: 'Laptop', description: 'Title of the category' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        example: ['windows', 'macbook', 'linux'],
        description: 'Titles of sub-categories',
    })
    @IsOptional()
    @IsNotEmpty()
    @IsArray()
    subCategories: string[];
}
