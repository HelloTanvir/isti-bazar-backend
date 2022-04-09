import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshToken, RefreshTokenSchema, User, UserSchema } from './schema';

@Module({
    imports: [
        JwtModule.register({}),
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: RefreshToken.name, schema: RefreshTokenSchema },
        ]),
    ],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
