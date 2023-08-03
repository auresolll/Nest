import { Module, OnModuleInit, forwardRef } from '@nestjs/common';
import { generateVAPIDKeys, setVapidDetails } from 'web-push';
import { AuthModule } from '../auth/auth.module';
import { environments } from './../../environments/environments';
import { notificationConfig } from './config/notificationConfig';
import { MobileNotificationService } from './services/mobile-notification.service';
import { WebNotificationService } from './services/web-notification.service';

@Module({
    imports: [forwardRef(() => AuthModule)],
    providers: [MobileNotificationService, WebNotificationService],
    exports: [MobileNotificationService, WebNotificationService],
})
export class NotificationModule implements OnModuleInit {
    onModuleInit() {
        const { privateKey, publicKey } = generateVAPIDKeys();
        const vapid = notificationConfig.vapid;
        if (vapid.publicKey && vapid.privateKey) {
            setVapidDetails(vapid.subject, publicKey, privateKey);

            return;
        }

        notificationConfig.vapid = {
            ...vapid,
            privateKey,
            publicKey,
        };

        notificationConfig.save();
    }
}
