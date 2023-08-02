import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Query,
    Res,
    UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthNotRequired } from '../decorators/auth-not-required.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { AuthService } from '../services/auth.service';
import { environments } from './../../../environments/environments';
import { User } from './../../user/schemas/user.schema';
import { UserService } from './../../user/services/user.service';
import { GoogleAuthService } from './../services/google-auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private userService: UserService,
        private googleAuthService: GoogleAuthService
    ) {}

    @Post('login')
    async login(
        @Body() body: LoginDto,
        @Res({ passthrough: true }) response: Response
    ) {
        const { access_token, refresh_token } = await this.authService.login(
            await this.authService.validate(body.email, body.password)
        );

        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            domain: environments.frontEndUrl,
        });

        return {
            access_token,
        };
    }

    @Post('google-login')
    @AuthNotRequired()
    async googleLogin(
        @CurrentUser() user: User,
        @Query('accessToken') accessToken: string,
        @Res({ passthrough: true }) response: Response
    ) {
        const { access_token, refresh_token } =
            await this.authService.loginWithThirdParty(
                'googleId',
                () => this.googleAuthService.getUser(accessToken),
                user
            );

        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            domain: environments.frontEndUrl,
        });

        return {
            access_token,
        };
    }

    @Post('refresh-token')
    async refreshToken(
        @Query('refreshToken') refreshToken: string,
        @Res({ passthrough: true }) response: Response
    ) {
        const { access_token, refresh_token } =
            await this.authService.loginWithRefreshToken(refreshToken);

        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            domain: environments.frontEndUrl,
        });

        return {
            access_token,
        };
    }

    @Post('register')
    async register(@Body() body: RegisterDto) {
        if (await this.userService.getUserByEmail(body.email))
            throw new BadRequestException('REGISTER.EMAIL ALREADY EXISTS');

        const user = await this.userService.create(body);
        return user;
    }

    @UseGuards(JwtAuthGuard)
    @Delete('logout-from-all-devices')
    async logoutFromAllDevices(
        @CurrentUser() user: User,
        @Res({ passthrough: true }) response: Response
    ) {
        user.generateSessionToken();

        await user.save();
        const { access_token, refresh_token } = await this.authService.login(
            user
        );

        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            domain: environments.frontEndUrl,
        });

        return {
            access_token,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    me(@CurrentUser() user: User) {
        return this.userService.filterUser(user, ['email']);
    }
}
