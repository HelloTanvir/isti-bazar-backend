import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @ApiProperty()
    @Prop({ required: [true, 'User name is required'] })
    name: string;

    @ApiProperty()
    @Prop({
        required: [true, 'User email address is required'],
        unique: true,
    })
    email: string;

    @ApiProperty()
    @Prop({ required: [true, 'User phone number is required'] })
    phoneNumber: string;

    @Prop({ required: [true, 'User password is required'] })
    password: string;

    @ApiProperty()
    @Prop({ default: null })
    refreshToken: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<User>('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
