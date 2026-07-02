import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisProvider } from './infrastructure/providers/redis/redis.provider';
import { ChatRpcController } from './presentation/controllers/chat-rpc.controller';
import {
  MessageSchema,
  MessageModelSchema,
} from './infrastructure/persistence/schemas/message.schema';
import { MongoMessageRepository } from './infrastructure/persistence/repositories/mongo-message.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),

    MongooseModule.forFeature([
      { name: MessageSchema.name, schema: MessageModelSchema },
    ]),
  ],
  controllers: [ChatRpcController],
  providers: [
    RedisProvider,
    {
      provide: 'IMessageRepository',
      useClass: MongoMessageRepository,
    },
  ],
  exports: [RedisProvider, 'IMessageRepository'],
})
export class ChatModule {}
