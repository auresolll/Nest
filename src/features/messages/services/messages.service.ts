import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Message } from '../schemas/messages.schema';
import { User } from './../../user/schemas/user.schema';
import { UserService } from './../../user/services/user.service';
import { ENUM_MESSAGE_TYPE } from '../constants/messages-type.enum';

@Injectable()
export class MessageService {
    constructor(
        @InjectModel(Message.name) private messageModel: Model<Message>,
        private userService: UserService
    ) {}

    async getFirstDirectMessage(from: User, to: User) {
        return this.messageModel
            .findOne(this.getDirectMessageFilter(from, to))
            .populate('from', this.userService.unpopulatedFields);
    }

    async getDirectMessages(from: User, to: User, limit = 30, before?: Date) {
        const filter: FilterQuery<Message> = {
            ...this.getDirectMessageFilter(from, to),
            createdAt: { $lte: before },
        };

        if (!before) {
            delete filter.createdAt;
        }

        return this.getMessages(filter, limit);
    }

    async createDirectMessage(
        from: User,
        to: User,
        message: string,
        type: ENUM_MESSAGE_TYPE
    ) {
        const object = await this.messageModel.create({
            from: from._id,
            to: to._id,
            message,
            type,
        });

        return object.populate('from', this.userService.unpopulatedFields);
    }

    private async getMessages(filter: FilterQuery<Message>, limit: number) {
        const messages = await this.messageModel
            .find(filter)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate('from', this.userService.unpopulatedFields);
        return this.sortMessages(messages);
    }

    sortMessages(messages: Message[]) {
        return messages.sort(
            (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
        );
    }

    private getDirectMessageFilter(from: User, to: User): FilterQuery<Message> {
        return {
            $or: [
                {
                    from: from._id,
                    to: to._id,
                },
                {
                    to: from._id,
                    from: to._id,
                },
            ],
        };
    }
}
