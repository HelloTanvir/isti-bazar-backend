import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { ProductInfo, ProductInfoSchema } from './product-info.schema';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
    @ApiProperty()
    @Prop({ required: [true, 'Product merchant id is required'] })
    merchantId: string;

    @ApiProperty()
    @Prop({ required: [true, 'Customer name is required'] })
    customerName: string;

    @ApiProperty()
    @Prop({ required: [true, 'Customer phone number is required'] })
    customerNumber: string;

    @ApiProperty()
    @Prop({ required: [true, 'Delivery city is required'] })
    city: string;

    @ApiProperty()
    @Prop({ required: [true, 'Delivery zone is required'] })
    zone: string;

    @ApiProperty()
    @Prop({ required: [true, 'Delivery area is required'] })
    area: string;

    @ApiProperty()
    @Prop({ required: [true, 'Delivery address is required'] })
    address: string;

    @ApiProperty()
    @Prop()
    specialMessage: string;

    @ApiProperty()
    @Prop()
    discount: string;

    @ApiProperty()
    @Prop()
    shipmentCharge: number;

    @ApiProperty()
    @Prop()
    advancedPayment: number;

    @ApiProperty({ type: [ProductInfo] })
    @Prop({
        type: [ProductInfoSchema],
        default: [],
    })
    products: ProductInfo[];

    @ApiProperty()
    @Prop({ default: 'pending' })
    status: string;

    @ApiProperty()
    @Prop({ required: [true, 'Cart item total is required'] })
    itemTotal: number;

    @ApiProperty()
    @Prop({ required: [true, 'Cart grand total is required'] })
    grandTotal: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.pre<Order>('save', async function () {
    this.discount = `${this.discount}%`;
});
