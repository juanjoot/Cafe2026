import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { RecommendProductDto } from '@shared/dto';

// Comentado hasta que exista realmente el módulo
// import { fetchLastOrder } from '../order/order.client';

@Injectable()
export class RecommendationService {
  constructor(private readonly redis: RedisService) {}

  async getForUser(userId: string) {
    const key = `recommendations:${userId}`;
    const cached = await this.redis.get(key);

    if (typeof cached === 'string') {
      return JSON.parse(cached);
    }

    // Simulación básica de productos recomendados
    const recommendations = [
      { id: 'cafe-1', name: 'Café del Huila' },
      { id: 'cafe-2', name: 'Café de Nariño' },
    ];

    // TTL de 3600 segundos
    await this.redis.set(key, recommendations, 3600);

    return recommendations;
  }

  // Método futuro, comentado por ahora hasta tener implementación válida
  // private async getLastPurchasedProduct(userId: string) {
  //   const order = await fetchLastOrder(userId);
  //   if (!order || !order.items?.length) return null;
  //   return order.items[0];
  // }
}
