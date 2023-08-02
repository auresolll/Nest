import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ObjectId } from 'mongoose';
import { User } from '../schemas/user.schema';

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

    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    getUserById(id: ObjectId | string) {
        return this.userModel.findById(id);
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
