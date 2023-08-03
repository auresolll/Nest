import { Injectable } from '@nestjs/common';
import { messaging } from 'firebase-admin';
import * as webPush from 'web-push';
import { PushSubscription } from 'web-push';
@Injectable()
export class WebNotificationService {
    sendNotification(
        subscription: PushSubscription,
        payload: messaging.WebpushConfig,
    ) {
        return webPush.sendNotification(
            subscription,
            JSON.stringify({
                ...payload,
                notification: { ...payload.notification, data: payload.data },
            }),
        );
    }
}
