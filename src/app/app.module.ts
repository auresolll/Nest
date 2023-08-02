import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { environments } from './../environments/environments';
import { FeaturesModule } from './../features/features.module';
import { AppController } from './controllers/app.controller';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(environments.mongoUri, {
            autoIndex: false,
        }),
        FeaturesModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
