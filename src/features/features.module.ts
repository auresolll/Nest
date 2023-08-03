import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MessagesModule } from './messages/messages.module';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';

@Module({
    imports: [UserModule, AuthModule, MessagesModule, NotificationModule],
    controllers: [],
    exports: [UserModule, AuthModule, MessagesModule, NotificationModule],
})
export class FeaturesModule {}
