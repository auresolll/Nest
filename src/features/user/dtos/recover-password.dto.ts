import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class RecoverPasswordDto {
    @ApiProperty({ default: 'a@a.com' })
    @IsString()
    @IsEmail()
    email: string;
}
