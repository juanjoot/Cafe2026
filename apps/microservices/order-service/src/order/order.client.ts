import axios from 'axios';

export async function fetchLastOrder(userId: string) {
  return {
    id: 'mock-order-id',
    items: ['producto1', 'producto2'],
    total: 40000,
  };
}
