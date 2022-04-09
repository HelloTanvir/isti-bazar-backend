import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto {
    @IsNotEmpty()
    @IsString()
    fullName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
