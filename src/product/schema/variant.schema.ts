import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Variant {
    @ApiProperty()
    @Prop({ required: [true, 'Variant code is required'] })
    variantCode: string;

    @ApiProperty()
    @Prop()
    size: string;

    @ApiProperty()
    @Prop({ required: [true, 'Variant color is required'] })
    color: string;

    @ApiProperty()
    @Prop({
        required: [true, 'Variant stock is required'],
        min: [0, 'Variant stock must be greater than 0'],
    })
    stock: number;

    @ApiProperty()
    @Prop({ required: [true, 'Product image keys are required'] })
    image: string;

    @ApiProperty()
    @Prop({ required: [true, 'Product image keys are required'] })
    key: string;
}

export const VariantSchema = SchemaFactory.createForClass(Variant);
