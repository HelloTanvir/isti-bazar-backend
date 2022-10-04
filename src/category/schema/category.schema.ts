import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, SchemaTypes } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
    @ApiProperty()
    @Prop({ required: [true, 'Category name is required'] })
    name: string;

    @ApiProperty()
    @Prop({ required: [true, 'Product merchant id is required'] })
    merchantId: string;

    @ApiProperty()
    @Prop({
        type: [SchemaTypes.String],
        default: [],
    })
    subCategories: string[];

    @ApiProperty()
    @Prop({
        min: [0, 'Stock must be greater than 0'],
        default: 0,
    })
    stock: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
