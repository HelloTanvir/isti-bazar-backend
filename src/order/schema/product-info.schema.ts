import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Variant } from '../../product/schema';

@Schema()
export class ProductInfo {
    @ApiProperty()
    @Prop({ required: [true, 'Product id is required'] })
    productId: string;

    @ApiProperty()
    @Prop({ required: [true, 'Variant id is required'] })
    variantId: string;

    @ApiProperty()
    @Prop({
        required: [true, 'Product quantity is required'],
        min: [1, 'Product quantity must be greater than 0'],
    })
    quantity: number;

    @Prop({ required: [true, 'Product name is required'] })
    @ApiProperty({ example: 'S' })
    productName: string;

    @Prop({ required: [true, 'Selected variant is required'] })
    @ApiProperty({ type: Variant })
    selectedVariant: Variant;

    @Prop({ required: [true, 'Other variant is required'] })
    @ApiProperty({ type: [Variant] })
    otherVariants: Variant[];
}

export const ProductInfoSchema = SchemaFactory.createForClass(ProductInfo);
