import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RecommendationModule } from './recommendation/recommendation.module';
import { RedisService } from './redis/redis.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), RecommendationModule],
  providers: [RedisService],
})
export class AppModule {}
