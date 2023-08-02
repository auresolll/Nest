import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { GoogleAuthService } from './services/google-auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Module({
    imports: [
        JwtModule.register({
            global: true,
        }),
        UserModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, GoogleAuthService, JwtAuthGuard],
    exports: [JwtAuthGuard, AuthService, JwtModule, UserModule],
})
export class AuthModule {}
