import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Variant {
    @ApiProperty()
    @Prop({ required: [true, 'Variant code is required'], unique: true })
    variantCode: string;

    @ApiProperty({ type: [String], isArray: true })
    @Prop({ type: [String], default: [] })
    sizes: string[];

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
    variantImage: string;

    @ApiProperty()
    @Prop({ required: [true, 'Product image keys are required'] })
    variantImageKey: string;
}

export const VariantSchema = SchemaFactory.createForClass(Variant);
