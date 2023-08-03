import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MessagesModule } from './messages/messages.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [UserModule, AuthModule, MessagesModule],
    controllers: [],
    exports: [UserModule, AuthModule, MessagesModule],
})
export class FeaturesModule {}
