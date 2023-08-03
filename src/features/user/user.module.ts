import {
    Module,
    OnModuleDestroy,
    OnModuleInit,
    forwardRef,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscription } from 'rxjs';
import { AuthModule } from '../auth/auth.module';
import { RecoverController } from './controllers/recover.controller';
import { SettingsController } from './controllers/settings.controller';
import { SubscriptionController } from './controllers/subscription.controller';
import { UserController } from './controllers/user.controller';
import { UserGateway } from './gateway/user.gateway';
import { Recover, RecoverSchema } from './schemas/recover.schema';
import {
    SocketConnection,
    SocketConnectionSchema,
} from './schemas/socket-connection.schema';
import { SubscriptionSchema } from './schemas/subscription.schema';
import { User, UserSchema } from './schemas/user.schema';
import { RecoverService } from './services/recover.service';
import { SocketConnectionService } from './services/socket-connection.service';
import { SubscriptionService } from './services/subscription.service';
import { UserService } from './services/user.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
            },
            {
                name: Recover.name,
                schema: RecoverSchema,
            },
            {
                name: SocketConnection.name,
                schema: SocketConnectionSchema,
            },
            {
                name: Subscription.name,
                schema: SubscriptionSchema,
            },
        ]),
        forwardRef(() => AuthModule),
        forwardRef(() => NotificationModule),
    ],
    controllers: [
        UserController,
        SubscriptionController,
        RecoverController,
        SettingsController,
    ],
    providers: [
        UserService,
        RecoverService,
        SubscriptionService,
        UserGateway,
        SocketConnectionService,
    ],
    exports: [
        UserService,
        SubscriptionService,
        UserGateway,
        SocketConnectionService,
    ],
})
export class UserModule implements OnModuleInit, OnModuleDestroy {
    constructor(private socketConnectionService: SocketConnectionService) {}
    onModuleInit() {
        this.deleteConnections();
    }
    onModuleDestroy() {
        this.deleteConnections();
    }

    deleteConnections() {
        return this.socketConnectionService.deleteAllConnections();
    }
}
