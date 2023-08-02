import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { User } from './../../user/schemas/user.schema';
import { UserService } from './../../user/services/user.service';
import { FetchMessagesDto } from '../dtos/fetch-messages.dto';
import { MessageService } from '../services/messages.service';

@UseGuards(JwtAuthGuard)
@Controller('message')
export class MessageController {
    constructor(
        private userService: UserService,
        private messageService: MessageService
    ) {}

    @Get('direct-first-message/:userId')
    async getFirstDirectMessage(
        @CurrentUser() user: User,
        @Param('userId') to: string
    ) {
        return this.messageService.getFirstDirectMessage(
            user,
            await this.userService.validateUserById(to)
        );
    }

    @Get('direct/:userId')
    async getDirectMessages(
        @CurrentUser() user: User,
        @Param('userId') to: string,
        @Query() query: FetchMessagesDto
    ) {
        return this.messageService.getDirectMessages(
            user,
            await this.userService.validateUserById(to),
            query.limit,
            query.before
        );
    }
}
