import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: 'createdAt' } })
export class User extends Document {
  @Prop({ required: true, unique: true, trim: true })
  username!: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ enum: ['admin', 'customer'], default: 'customer' })
  role!: string;

  @Prop()
  createdAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
