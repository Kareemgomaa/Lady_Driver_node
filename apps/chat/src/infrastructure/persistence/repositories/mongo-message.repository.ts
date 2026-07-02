import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IMessageRepository } from '../../../application/ports/message-repository.interface';
import { Message } from '../../../domain/entities/message.entity';
import { MessageSchema, MessageDocument } from '../schemas/message.schema';

@Injectable()
export class MongoMessageRepository implements IMessageRepository {
  constructor(
    @InjectModel(MessageSchema.name)
    private readonly messageModel: Model<MessageDocument>,
  ) {}

  async save(message: Message): Promise<Message> {
    const createdMessage = new this.messageModel({ ...message });
    const savedDoc = await createdMessage.save();

    return new Message({
      id: savedDoc._id.toString(),
      tripId: savedDoc.tripId,
      senderId: savedDoc.senderId,
      message: savedDoc.message,
      location: savedDoc.location,
      seen: savedDoc.seen,
      createdAt: (savedDoc as any).createdAt,
    });
  }

  async findByTripId(tripId: string): Promise<Message[]> {
    const docs = await this.messageModel
      .find({ tripId })
      .sort({ createdAt: 1 })
      .exec();
    return docs.map(
      (doc) =>
        new Message({
          id: doc._id.toString(),
          tripId: doc.tripId,
          senderId: doc.senderId,
          message: doc.message,
          location: doc.location,
          seen: doc.seen,
          createdAt: (doc as any).createdAt,
        }),
    );
  }

  async markAsSeen(tripId: string, userId: string): Promise<void> {
    await this.messageModel
      .updateMany(
        { tripId, senderId: { $ne: userId }, seen: false },
        { $set: { seen: true } },
      )
      .exec();
  }
}
