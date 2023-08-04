import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { MessagesModule } from './messages/messages.module';
import { NotificationModule } from './notification/notification.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        UserModule,
        AuthModule,
        MessagesModule,
        NotificationModule,
        FileModule,
    ],
    controllers: [],
    exports: [
        UserModule,
        AuthModule,
        MessagesModule,
        NotificationModule,
        FileModule,
    ],
})
export class FeaturesModule {}
