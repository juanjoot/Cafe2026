export class CreateOrderDto {
  items!: Array<{ productId: string; quantity: number; price?: number }>;
  total!: number;
  customerId?: string;
  status?: string;
}

export class SendEmailDto {
  to!: string;
  subject!: string;
  text?: string;
  html?: string;
  body?: string;
  from?: string;
  attachments?: Array<{ filename?: string; path?: string; content?: string; href?: string }>;
}

export class CreatePaymentDto {
  amount!: number;
  currency?: string;
  userId?: string;
  orderId?: string;
  method?: string;
  source?: string;
  email?: string;
}

export class RecommendProductDto {
  userId?: string;
  productId?: string;
  category?: string;
  limit?: number;
}
