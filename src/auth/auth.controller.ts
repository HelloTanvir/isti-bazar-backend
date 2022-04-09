import { Body, Controller, Delete, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LogoutDto, SignUpDto } from './dto';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    signUp(@Body() dto: SignUpDto): Promise<Tokens> {
        return this.authService.signUp(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() dto: LoginDto): Promise<Tokens> {
        return this.authService.login(dto);
    }

    @Delete('logout')
    @HttpCode(HttpStatus.OK)
    logout(@Body() dto: LogoutDto): Promise<string> {
        return this.authService.logout(dto);
    }
}
