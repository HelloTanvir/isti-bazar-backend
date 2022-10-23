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

    // required extra fields
    @ApiProperty({ example: 'S' })
    productName: string;

    @ApiProperty({ type: Variant })
    selectedVariant: Variant;

    @ApiProperty({ type: [Variant] })
    otherVariants: Variant[];
}

export const ProductInfoSchema = SchemaFactory.createForClass(ProductInfo);
