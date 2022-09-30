import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { Variant, VariantSchema } from './variant.schema';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
    @ApiProperty()
    @Prop({ required: [true, 'Product name is required'] })
    name: string;

    @ApiProperty()
    @Prop({ required: [true, 'Product images are required'] })
    thumbImage: string;

    @ApiProperty()
    @Prop({ required: [true, 'Product image keys are required'] })
    thumbImageKey: string;

    @ApiProperty()
    @Prop({ required: [true, 'Product code is required'], unique: true })
    code: string;

    @ApiProperty()
    @Prop({ required: [true, 'Product category is required'] })
    category: string;

    @ApiProperty()
    @Prop({
        required: [true, 'Product buying price is required'],
        min: [0, 'Product buying price must be greater than 0'],
    })
    buyingPrice: number;

    @ApiProperty()
    @Prop({
        required: [true, 'Product selling price is required'],
        min: [0, 'Product selling price must be greater than 0'],
    })
    sellingPrice: number;

    @ApiProperty()
    @Prop({
        required: [true, 'Product stock is required'],
        min: [0, 'Product stock must be greater than 0'],
    })
    stock: number;

    @ApiProperty()
    @Prop({ required: [true, 'Product description is required'] })
    description: string;

    @ApiProperty({ type: [Variant], isArray: true })
    @Prop({ type: [VariantSchema], default: [] })
    variants: Variant[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
