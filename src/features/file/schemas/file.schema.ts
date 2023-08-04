import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { createSchemaForClassWithMethods } from '../../../shared/mongoose/create-schema';
import { ObjectId } from '../../../shared/mongoose/object-id';
import { User } from '../../user/schemas/user.schema';

export enum FileType {
    Image = 'Image',
    Document = 'Document',
    Media = 'Media',
}
@Schema()
export class File extends Document {
    @Prop({ required: true })
    file_name: string;

    @Prop({ required: true })
    url: string;

    @Prop({ type: ObjectId, ref: User.name })
    owner: User;

    @Prop({ enum: FileType, required: true })
    type: FileType;
}

export const FileSchema = createSchemaForClassWithMethods(File);
