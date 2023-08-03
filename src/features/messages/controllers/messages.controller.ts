import { Body, Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { FetchMessagesDto } from '../dtos/fetch-messages.dto';
import { MessageService } from '../services/messages.service';
import { User } from './../../user/schemas/user.schema';
import { UserService } from './../../user/services/user.service';

@ApiTags('Message')
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
        const userTo = await this.userService.validateUserById(to);
        return this.messageService.getFirstDirectMessage(user, userTo);
    }

    @Get('direct/:userId')
    async getDirectMessages(
        @CurrentUser() user: User,
        @Param('userId') to: string,
        @Body() query: FetchMessagesDto
    ) {
        const userTo = await this.userService.validateUserById(to);
        return this.messageService.getDirectMessages(
            user,
            userTo,
            query.limit,
            query.before
        );
    }
}
