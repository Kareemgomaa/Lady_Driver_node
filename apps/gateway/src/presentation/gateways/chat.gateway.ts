import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(
    @Inject('CHAT_SERVICE') private readonly chatServiceClient: ClientProxy,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected to Socket: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_trip')
  handleJoinTrip(
    @MessageBody() data: { tripId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.tripId);
    console.log(`Client ${client.id} joined Room/Trip: ${data.tripId}`);
  }

  @SubscribeMessage('send_msg')
  handleSendMessage(
    @MessageBody()
    payload: {
      tripId: string;
      senderId: string;
      message: string;
      location?: any;
    },
  ) {
    console.log('New msg via WebSocket:', payload);

    this.chatServiceClient.emit('msg_sent', payload);

    this.server.to(payload.tripId).emit('new_msg', payload);
  }
}
