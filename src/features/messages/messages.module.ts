import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { MessageController } from './controllers/messages.controller';
import { MessagesGateway } from './gateways/messages.gateway';
import { Message, MessageSchema } from './schemas/messages.schema';
import { MessageService } from './services/messages.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Message.name,
                schema: MessageSchema,
            },
        ]),
        UserModule,
        AuthModule,
    ],
    controllers: [MessageController],
    providers: [MessagesGateway, MessageService],
})
export class MessagesModule {}
