import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { createSchemaForClassWithMethods } from '../../../shared/mongoose/create-schema';
import { ObjectId } from '../../../shared/mongoose/object-id';
import { ENUM_MESSAGE_TYPE } from '../constants/messages-type.enum';
import { User } from './../../user/schemas/user.schema';

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
