import { Module } from '@nestjs/common';
import { MessagesService } from './services/messages.service';
import { MessagesGateway } from './gateways/messages.gateway';

@Module({
    providers: [MessagesGateway, MessagesService],
})
export class MessagesModule {}
