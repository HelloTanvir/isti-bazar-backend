import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type OrderDocument = Order & Document;

class ProductInfo {
    @Prop({ type: SchemaTypes.String, required: [true, 'Product id is required'] })
    id: string;

    @Prop({
        type: SchemaTypes.Number,
        required: [true, 'Product quantity is required'],
        min: [1, 'Product quantity must be greater than 0'],
    })
    quantity: string;
}

@Schema({ timestamps: true })
export class Order {
    // customer details
    @Prop({ type: SchemaTypes.String, required: [true, 'Customer name is required'] })
    name: string;

    @Prop({ type: SchemaTypes.String, required: [true, 'Customer phone number is required'] })
    number: string;

    // product details
    @Prop({ type: [typeof ProductInfo], required: [true, 'Product details are required'] })
    products: ProductInfo[];

    // delivery details
    @Prop({ type: SchemaTypes.String, required: [true, 'Customer address is required'] })
    address: string;

    // status
    @Prop({ type: SchemaTypes.String, default: 'pending' })
    status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
