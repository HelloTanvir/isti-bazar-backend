import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { LoginDto, SignUpDto } from './dto';
import { RefreshToken, RefreshTokenDocument, User, UserDocument } from './schema';
import { Tokens } from './types';

@Injectable()
export class AuthService {
    constructor(
        private config: ConfigService,
        private jwtService: JwtService,
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        @InjectModel(RefreshToken.name)
        private readonly refreshTokenModel: Model<RefreshTokenDocument>
    ) {}

    async signUp(dto: SignUpDto): Promise<Tokens> {
        // check if the user exists with the provided email
        const user = await this.userModel.findOne({ email: dto.email });

        if (user) {
            throw new ForbiddenException('user already exists');
        }

        // create user
        const newUser = await this.userModel.create(dto);

        const tokens = await this.getTokens(newUser._id.toString(), newUser.email);

        // create refresh token
        await this.refreshTokenModel.create({
            userId: newUser._id,
            refreshToken: tokens.refresh_token,
        });

        return tokens;
    }

    async login(dto: LoginDto): Promise<Tokens> {
        // find the user with email
        const user = await this.userModel.findOne({ email: dto.email });

        if (!user) {
            throw new ForbiddenException('invalid email or password');
        }

        // compare user password
        const isPasswordMatch = await bcrypt.compare(dto.password, user.password);

        if (!isPasswordMatch) {
            throw new ForbiddenException('invalid email or password');
        }

        const tokens = await this.getTokens(user._id.toString(), user.email);

        // update refresh token in db
        await this.refreshTokenModel.updateOne(
            { userId: user._id },
            { refreshToken: tokens.refresh_token }
        );

        return tokens;
    }

    async logout(userId: number | string): Promise<string> {
        // update refresh token to null in db
        await this.refreshTokenModel.updateOne({ userId }, { refreshToken: null });

        return 'logged out';
    }

    private async getTokens(userId: number | string, email: string) {
        const [at, rt] = await Promise.all([
            // access token
            this.jwtService.signAsync(
                {
                    userId,
                    email,
                },
                {
                    secret: this.config.get('AT_SECRET_KEY'),
                    expiresIn: 60 * 15, // 15 min
                }
            ),

            // refresh token
            this.jwtService.signAsync(
                {
                    userId,
                    email,
                },
                {
                    secret: this.config.get('RT_SECRET_KEY'),
                    expiresIn: 60 * 60 * 24 * 7, // 1 week
                }
            ),
        ]);

        return {
            access_token: at,
            refresh_token: rt,
        };
    }
}
