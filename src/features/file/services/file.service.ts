import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { File } from '../schemas/file.schema';
import { User } from '../../user/schemas/user.schema';

@Injectable()
export class FileService {
    constructor(@InjectModel(File.name) private FileModel: Model<File>) {}

    async create(body: Partial<File>) {
        const object = await this.FileModel.create(body);
        return object.save();
    }

    delete(user: User, fileId: string) {
        return this.FileModel.findOneAndDelete({
            _id: new Types.ObjectId(fileId),
            owner: user,
        });
    }

    deleteAll(user: User, fileIds: string[]): any {
        return this.FileModel.deleteMany({
            _id: { $in: fileIds },
            owner: user,
        });
    }
}
