import { Module } from '@nestjs/common';
import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';
import { RedisService } from '../redis/redis.service';

@Module({
  controllers: [RecommendationController],
  providers: [RecommendationService, RedisService],
})
export class RecommendationModule {}
