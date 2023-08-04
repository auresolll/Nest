import { Socket } from 'socket.io';
import {
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    NotFoundException,
    forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ObjectId } from 'mongoose';
import { User } from '../schemas/user.schema';
import { UserGateway } from '../gateway/user.gateway';
import { SocketConnectionService } from './socket-connection.service';

@Injectable()
export class UserService {
    private blockedFields: (keyof User)[] = [
        'password',
        'sessionToken',
        'email',
        'facebookId',
        'googleId',
    ];

    unpopulatedFields = '-' + this.blockedFields.join(' -');

    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @Inject(forwardRef(() => UserGateway)) private userGateway: UserGateway,
        private socketConnectionService: SocketConnectionService,
    ) {}

    getUserById(id: ObjectId | string) {
        return this.userModel.findById(id);
    }

    getOnlineUsers() {
        return this.userModel.find({
            online: true,
        });
    }
    getUserByName(name: string) {
        const username = { $regex: new RegExp(`^${name}$`, 'i') };

        return this.userModel.findOne({ username });
    }

    getUserByEmail(mail: string) {
        const email = { $regex: new RegExp(`^${mail}$`, 'i') };

        return this.userModel.findOne({ email });
    }

    getUserBy(filter: FilterQuery<User>) {
        return this.userModel.findOne(filter);
    }

    async validateUserById(id: string) {
        const user = await this.getUserById(id);

        if (!user) {
            throw new NotFoundException('USER.NOT_FOUND');
        }

        return user;
    }

    async validateUserByName(username: string) {
        const user = await this.getUserByName(username);

        if (!user)
            throw new HttpException('USER.NOT_FOUND', HttpStatus.NOT_FOUND);

        return user;
    }

    async validateUserByEmail(mail: string) {
        const user = await this.getUserByEmail(mail);

        if (!user)
            throw new HttpException('USER.NOT_FOUND', HttpStatus.NOT_FOUND);

        return user;
    }

    async create(body: Partial<User>) {
        const user = await this.userModel.create(body);
        user.generateSessionToken();
        return user.save();
    }

    sendMessage<T>(user: User, event: string, message?: T) {
        return this.userGateway.server
            .to(`user_${user._id}`)
            .emit(event, message);
    }

    async subscribeSocket(socket: Socket, user: User) {
        await this.socketConnectionService.create(socket, user);
        return socket.join(`user_${user._id}`);
    }

    async unsubscribeSocket(socket: Socket, user: User) {
        await this.socketConnectionService.delete(socket);
        return socket.leave(`user_${user._id}`);
    }

    filterUser(user: User, allowedFields: (keyof User)[] = []) {
        const userObject = user.toObject({ virtuals: true });

        for (const field of this.blockedFields) {
            if (allowedFields.includes(field)) {
                continue;
            }

            delete userObject[field];
        }

        return userObject;
    }
}
