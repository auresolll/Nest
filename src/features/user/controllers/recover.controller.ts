import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
} from '@nestjs/common';
import { RecoverPasswordDto } from '../dtos/recover-password.dto';
import { UpdatePasswordDto } from '../dtos/update-password.dto';
import { Recover } from '../schemas/recover.schema';
import { User } from '../schemas/user.schema';
import { RecoverService } from '../services/recover.service';
import { UserService } from '../services/user.service';
import { environments } from './../../../environments/environments';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MailerService } from '@nestjs-modules/mailer';

@ApiTags('Recover')
@Controller('recover')
export class RecoverController {
    constructor(
        private userService: UserService,
        private recoverService: RecoverService,
        private mailerService: MailerService
    ) {}

    @ApiOperation({
        summary: 'Validate recover code',
    })
    @Get(':code')
    @ApiParam({
        name: 'code',
        type: 'string',
    })
    async validateRecoverCode(@Param('code') code: Recover['code']) {
        const recover = await this.validateCode(code);

        recover.owner = this.userService.filterUser(recover.owner) as User;

        return recover;
    }

    @ApiOperation({
        summary: 'Send recover Password to mail',
    })
    @Post()
    async recoverPassword(@Body() body: RecoverPasswordDto) {
        const user = await this.userService.validateUserByEmail(body.email);

        const { code, expiration } = await this.recoverService.create(user);

        const url = environments.frontEndUrl;

        try {
            const sendMail = await this.mailerService.sendMail({
                to: user.email,
                subject: 'Recover your password',
                template: './recover', // This will fetch /template/recover.hbs
                context: {
                    name: user.username,
                    url,
                    code,
                    expiration: Math.round(
                        (expiration.getTime() - Date.now()) / 1000 / 60 / 60
                    ),
                },
            });
            return sendMail ? 1 : 0;
        } catch (e) {
            throw new HttpException(
                `AN ERROR OCCURRED SENDING EMAIL: ${e.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
    // online: false,
    // _id: '64c9d23b57fcb444533e6bbb',
    // isSocial: false,
    // id: '64c9d23b57fcb444533e6bbb',
    @ApiOperation({
        summary: 'Change password',
    })
    @Post(':code')
    @ApiParam({
        name: 'code',
        type: 'string',
    })
    async changePassword(
        @Param('code') code: Recover['code'],
        @Body() body: UpdatePasswordDto
    ) {
        const recover = await this.validateCode(code);

        if (body.password !== body.confirmPassword) {
            throw new HttpException(
                'RECOVER.PASSWORD DOES NOT MATCH',
                HttpStatus.BAD_REQUEST
            );
        }

        const user = recover.owner;

        if (await user.validatePassword(body.password)) {
            throw new HttpException(
                'RECOVER.DO NOT USE YOUR CURRENT PASSWORD',
                HttpStatus.BAD_REQUEST
            );
        }

        user.password = body.password;

        await this.recoverService.delete(user);

        return this.userService.filterUser(await user.save());
    }

    private async validateCode(code: string) {
        const recover = await this.recoverService.get(code);

        if (!recover)
            throw new HttpException(
                'RECOVER.CODE.NOT_FOUND',
                HttpStatus.NOT_FOUND
            );

        if (recover.expiration?.getTime() < Date.now()) {
            await this.recoverService.delete(recover.owner);

            throw new HttpException(
                'RECOVER.CODE.HAS_EXPIRED',
                HttpStatus.NOT_FOUND
            );
        }

        return recover;
    }
}
