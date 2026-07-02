import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class ChatRpcController {
  @MessagePattern('msg_sent')
  handleMessageSent(@Payload() data: any) {
    console.log(
      '[Chat Microservice] Received a new message event via RabbitMQ:',
    );
    console.log(data);
  }
}
