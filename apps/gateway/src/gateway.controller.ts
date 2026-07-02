import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('chat')
export class GatewayController {
  constructor(
    @Inject('CHAT_SERVICE') private readonly chatClient: ClientProxy,
  ) {}

  @Post('send')
  sendMessage(
    @Body() body: { tripId: string; senderId: string; message: string },
  ) {
    this.chatClient.emit('msg_sent', body);

    return {
      success: true,
      message: 'Message pushed to RabbitMQ successfully!',
    };
  }
}
