import { Order } from "../../generated/prisma";

export interface OrderResponse {
  id: number;
  totalItems: number;
  etaMinutes: number;
  orderedAt: Date;
  customerId: number;
  restaurantId: number;
}

export interface CreateOrderRequest {
  totalItems: number;
  customerId: number;
  restaurantId: number;
}

export function toOrderResponse(order: Order): OrderResponse {
  return {
    id: order.id,
    totalItems: order.totalItems,
    etaMinutes: order.etaMinutes,
    orderedAt: order.orderedAt,
    customerId: order.customerId,
    restaurantId: order.restaurantId
  };
}
