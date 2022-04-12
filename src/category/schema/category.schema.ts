import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
    @Prop({ type: SchemaTypes.String, required: [true, 'Category name is required'], unique: true })
    name: string;

    @Prop({
        type: SchemaTypes.Number,
        required: [true, 'Stock is required'],
        min: [0, 'Stock must be greater than 0'],
    })
    stock: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
