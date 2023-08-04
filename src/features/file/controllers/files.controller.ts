import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/features/auth/guard/jwt-auth.guard';
import { CreateFileDto } from '../dtos/create-file.dto';
import { FileService } from '../services/file.service';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../user/schemas/user.schema';

@UseGuards(JwtAuthGuard)
@Controller('file')
export class FileController {
    constructor(private readonly fileService: FileService) {}

    @Post('')
    async createFile(@CurrentUser() user: User, @Body() body: CreateFileDto) {
        return this.fileService.create({
            ...body,
            owner: user._id,
        });
    }

    @Delete('')
    async deleteFile(
        @CurrentUser() user: User,
        @Body('fileId') fileId: string,
    ) {
        return this.fileService.delete(user, fileId);
    }

    @Delete('many')
    async deleteManyFile(
        @CurrentUser() user: User,
        @Body('fileIds') fileIds: string[],
    ) {
        return this.fileService.deleteAll(user, fileIds);
    }
}
