import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString, MaxLength } from 'class-validator';
import { ENUM_MESSAGE_TYPE } from '../constants/messages-type.enum';

export class DirectMessageDto {
    @ApiProperty({ required: true })
    @IsString()
    @MaxLength(2000)
    message: string;

    @ApiProperty({ enum: ENUM_MESSAGE_TYPE, required: true })
    type: ENUM_MESSAGE_TYPE;

    @ApiProperty({ required: true })
    @IsMongoId()
    to: string;
}
