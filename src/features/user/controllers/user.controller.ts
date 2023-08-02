import { LoggingInterceptor } from './../../../shared/interception/logging.interceptor';
import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';

@ApiTags('User')
@Controller('user')
@UseInterceptors(LoggingInterceptor)
export class UserController {
    constructor(private userService: UserService) {}

    @Get(':username')
    async getUser(@Param('username') username: string) {
        return this.userService.filterUser(
            await this.userService.validateUserByName(username)
        );
    }
}
