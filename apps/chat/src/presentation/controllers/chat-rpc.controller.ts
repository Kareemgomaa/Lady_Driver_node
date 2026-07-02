import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import type { IMessageRepository } from '../../application/ports/message-repository.interface';
import { Message } from '../../domain/entities/message.entity';

@Controller()
export class ChatRpcController {
  constructor(
    @Inject('IMessageRepository')
    private readonly messageRepository: IMessageRepository,
  ) {}

  @EventPattern('msg_sent')
  async handleSendMessage(@Payload() data: any) {
    console.log(
      '[Chat Microservice] Received a new message event via RabbitMQ:',
      data,
    );

    try {
      const messageEntity = new Message({
        tripId: data.tripId,
        senderId: data.senderId,
        message: data.message,
        location: data.location,
        seen: false,
      });

      const savedMessage = await this.messageRepository.save(messageEntity);

      console.log(
        'Message successfully saved to MongoDB Atlas with ID:',
        savedMessage.id,
      );
    } catch (error) {
      console.error('Error saving message to MongoDB Atlas:', error.message);
    }
  }
}
