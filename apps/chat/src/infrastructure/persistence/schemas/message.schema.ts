import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = MessageSchema & Document;

@Schema({ timestamps: true })
export class MessageSchema {
  @Prop({ required: true })
  tripId!: string;

  @Prop({ required: true })
  senderId!: string;

  @Prop({ required: true })
  message!: string;

  @Prop({ type: Object })
  location?: { lat: number; lng: number };

  @Prop({ default: false })
  seen!: boolean;
}

export const MessageModelSchema = SchemaFactory.createForClass(MessageSchema);
