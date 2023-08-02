import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Recover, RecoverSchema } from './schemas/recover.schema';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './controllers/user.controller';
import { SettingsController } from './controllers/settings.controller';
import { RecoverController } from './controllers/recover.controller';
import { RecoverService } from './services/recover.service';
import { UserService } from './services/user.service';

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
        ]),
    ],
    controllers: [UserController, RecoverController, SettingsController],
    providers: [UserService, RecoverService],
    exports: [UserService],
})
export class UserModule {}
