import { WebSocketGateway } from '@nestjs/websockets';
import { MessagesService } from '../services/messages.service';

@WebSocketGateway()
export class MessagesGateway {
    constructor(private readonly messagesService: MessagesService) {}
}
