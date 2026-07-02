import { Module } from '@nestjs/common';
import { RedisProvider } from './infrastructure/providers/redis/redis.provider';
import { ChatRpcController } from './presentation/controllers/chat-rpc.controller';

@Module({
  imports: [],
  controllers: [ChatRpcController],
  providers: [RedisProvider],
  exports: [RedisProvider],
})
export class ChatModule {}
