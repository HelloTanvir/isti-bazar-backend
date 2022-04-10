import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { GetCurrentUser, Public } from '../common/decorators';
import { AuthService } from './auth.service';
import { LoginDto, SignUpDto } from './dto';
import { User } from './schema';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    signUp(@Body() dto: SignUpDto): Promise<Tokens> {
        return this.authService.signUp(dto);
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() dto: LoginDto): Promise<Tokens> {
        return this.authService.login(dto);
    }

    @Delete('logout')
    @HttpCode(HttpStatus.OK)
    logout(@GetCurrentUser('userId') userId: number | string): Promise<string> {
        console.log({ userId });

        return this.authService.logout(userId);
    }

    @Get('get-me')
    @HttpCode(HttpStatus.OK)
    getMe(@GetCurrentUser('userId') userId: number | string): Promise<User> {
        return this.authService.getMe(userId);
    }
}
