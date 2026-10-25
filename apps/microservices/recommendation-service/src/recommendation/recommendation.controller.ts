import { Controller, Get, Query } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { RecommendProductDto } from '@shared/dto';


@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get()
  getRecommendations(@Query('userId') userId: string) {
    return this.recommendationService.getForUser(userId);
  }
}
