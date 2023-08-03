import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional } from 'class-validator';

export class FetchMessagesDto {
    @ApiProperty({ default: 30 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit = 30;

    @ApiProperty()
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    before: Date;
}
