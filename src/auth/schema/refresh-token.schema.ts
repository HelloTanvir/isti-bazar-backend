import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Document, SchemaTypes, Types } from 'mongoose';

export type RefreshTokenDocument = RefreshToken & Document;

@Schema({ timestamps: true })
export class RefreshToken {
    @Prop({ type: SchemaTypes.ObjectId, required: [true, 'User id is required'] })
    userId: Types.ObjectId;

    @Prop({ type: SchemaTypes.String, required: [true, 'Refresh token is required'] })
    refreshToken: string;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);

RefreshTokenSchema.pre<RefreshToken>('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.refreshToken = await bcrypt.hash(this.refreshToken, salt);
});
