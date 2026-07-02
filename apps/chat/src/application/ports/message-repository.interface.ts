import { Message } from '../../domain/entities/message.entity';

export interface IMessageRepository {
  save(message: Message): Promise<Message>;
  findByTripId(tripId: string): Promise<Message[]>;
  markAsSeen(tripId: string, userId: string): Promise<void>;
}
