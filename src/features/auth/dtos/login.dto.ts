import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({ default: 'test@a.com' })
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty({ default: 'test' })
    @IsNotEmpty()
    @IsString()
    password: string;
}
