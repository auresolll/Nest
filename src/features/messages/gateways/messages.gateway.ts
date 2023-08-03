import {
    UseFilters,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CurrentUser } from 'src/features/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/features/auth/guard/jwt-auth.guard';
import { User } from 'src/features/user/schemas/user.schema';
import { DirectMessageDto } from '../dtos/direct-message.dto';
import { MessageService } from '../services/messages.service';
import { ExceptionsFilter } from './../../../core/filter/exceptions.filter';
import { ParseObjectIdPipe } from './../../../shared/pipe/parse-object-id.pipe';
import { UserService } from './../../user/services/user.service';

@UsePipes(new ValidationPipe())
@UseFilters(new ExceptionsFilter())
@UseGuards(JwtAuthGuard)
@WebSocketGateway()
export class MessagesGateway {
    @WebSocketServer() server: Server;

    constructor(
        private readonly messageService: MessageService,
        private userService: UserService,
    ) {}

    @SubscribeMessage('message:direct')
    async sendDirectMessage(
        @MessageBody() body: DirectMessageDto,
        @CurrentUser() user: User,
    ) {
        const userTo = await this.userService.validateUserById(body.to);

        const message = await this.messageService.createDirectMessage(
            user,
            userTo,
            body.message,
            body.type,
        );

        this.userService.sendMessage(user, 'message:direct', message);
        this.userService.sendMessage(userTo, 'message:direct', message);

        return true;
    }

    @SubscribeMessage('message:direct:typing')
    async sendDirectTyping(
        @MessageBody(new ParseObjectIdPipe()) userId: string,
        @CurrentUser() user: User,
    ) {
        return this.userService.sendMessage(
            await this.userService.validateUserById(userId),
            'message:direct:typing',
            { user: this.userService.filterUser(user) },
        );
    }
}
