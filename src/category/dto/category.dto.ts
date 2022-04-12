import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LoginDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    stock: number;
}
