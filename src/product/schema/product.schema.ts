import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
    @Prop({ type: SchemaTypes.String, required: [true, 'Product name is required'] })
    name: string;

    @Prop({ type: [SchemaTypes.String], required: [true, 'Product images are required'] })
    images: string[];

    @Prop({ type: SchemaTypes.String, required: [true, 'Product code is required'], unique: true })
    code: string;

    @Prop({ type: SchemaTypes.String, required: [true, 'Product category is required'] })
    category: string;

    @Prop({
        type: SchemaTypes.Number,
        required: [true, 'Product price is required'],
        min: [0, 'Product price must be greater than 0'],
    })
    price: number;

    @Prop({
        type: SchemaTypes.Number,
        required: [true, 'Product stock is required'],
        min: [0, 'Product stock must be greater than 0'],
    })
    stock: number;

    @Prop({ type: SchemaTypes.String, required: [true, 'Product size is required'] })
    size: string;

    @Prop({ type: SchemaTypes.String, required: [true, 'Product color is required'] })
    color: string;

    @Prop({ type: SchemaTypes.String, required: [true, 'Product description is required'] })
    description: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
