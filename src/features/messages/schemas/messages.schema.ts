import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { createSchemaForClassWithMethods } from '../../../shared/mongoose/create-schema';
import { ObjectId } from '../../../shared/mongoose/object-id';
import { User } from './../../user/schemas/user.schema';

export enum ENUM_MESSAGE_TYPE {
    MESSAGE = 'MESSAGE',
    FILE_IMAGE = 'FILE_IMAGE',
    FILE_DOC = 'FILE_DOC',
    FILE_MEDIA = 'FILE_MEDIA',
}

@Schema()
export class Message extends Document {
    @Prop({
        required: true,
    })
    message: string;

    @Prop({
        required: true,
        enum: ENUM_MESSAGE_TYPE,
    })
    type: ENUM_MESSAGE_TYPE;

    @Prop({ type: ObjectId, ref: User.name })
    from: User;

    @Prop({ type: ObjectId, ref: User.name })
    to?: User;

    @Prop({
        type: Date,
        default: Date.now,
    })
    createdAt: Date;

    @Prop({
        type: Date,
        default: Date.now,
    })
    updatedAt: Date;
}

export const MessageSchema = createSchemaForClassWithMethods(Message);
