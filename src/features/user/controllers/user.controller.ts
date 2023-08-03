import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from './../../auth/guard/jwt-auth.guard';

@ApiTags('User')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private userService: UserService) {}

    @Get(':username')
    async getUser(@Param('username') username: string) {
        return this.userService.filterUser(
            await this.userService.validateUserByName(username),
        );
    }
}
