import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { FileType } from '../schemas/file.schema';

export class CreateFileDto {
    @ApiProperty()
    @IsString()
    file_name: string;

    @ApiProperty()
    @IsString()
    url: string;

    @ApiProperty({ enum: FileType })
    type: FileType;
}
