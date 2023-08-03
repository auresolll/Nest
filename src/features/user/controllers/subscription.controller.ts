import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/features/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/features/auth/guard/jwt-auth.guard';
import { SubscriptionType } from '../schemas/subscription.schema';
import { User } from '../schemas/user.schema';
import { SubscriptionService } from '../services/subscription.service';

@ApiTags('Subscription')
@UseGuards(JwtAuthGuard)
@Controller('subscription')
export class SubscriptionController {
    constructor(private subscriptionService: SubscriptionService) {}

    @Get()
    sendTestingNotification(@CurrentUser() user: User) {
        return this.subscriptionService.sendNotification(user, {
            notification: {
                title: 'Testing',
                body: 'Testing notification',
            },
        });
    }

    @Post('web')
    createWebSubscription(
        @Body() body: PushSubscriptionJSON,
        @CurrentUser() user: User,
    ) {
        return this.createSubscription(
            user,
            SubscriptionType.Web,
            JSON.stringify(body),
        );
    }

    private async createSubscription(
        user: User,
        type: SubscriptionType,
        body: string,
    ) {
        if (!body) throw new BadRequestException('SUBSCRIPTION BODY EMPTY');

        const subscription = await this.subscriptionService.get(
            user,
            type,
            body,
        );

        return (
            subscription || this.subscriptionService.create(user, type, body)
        );
    }
}
