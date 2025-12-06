import { prismaClient } from "../utils/databse-util";
import { ResponseError } from "../error/response-error";
import { Validation } from "../validations/validation";
import { OrderValidation } from "../validations/order-validation";
import {
  CreateOrderRequest,
  OrderResponse,
  toOrderResponse
} from "../models/order-model";

export class OrderService {

  // ===============================
  // Helpers
  // ===============================

  private static validateBody(payload: any) {
    return Validation.validate(OrderValidation.CREATE, payload);
  }

  private static async assertExist(id: number, model: "customer" | "restaurant") {
    const found = await prismaClient.order.findUnique({
      where: { id }
    });

    if (!found) {
      const name = model === "customer" ? "Customer" : "Restaurant";
      throw new ResponseError(404, `${name} not found`);
    }
  }

  private static calcEta(items: number): number {
    return items * 10 + 10;
  }

  private static async loadOrders(filter: any): Promise<OrderResponse[]> {
    const orders = await prismaClient.order.findMany({
      where: filter,
      include: {
        customer: true,
        restaurant: true
      }
    });

    return orders.map(toOrderResponse);
  }

  // ===============================
  // MAIN METHODS
  // ===============================

  static async create(request: CreateOrderRequest): Promise<OrderResponse> {
    // 1. Validate input
    const data = this.validateBody(request);

    // 2. Validate foreign keys
    await Promise.all([
      this.assertExist(data.customerId, "customer"),
      this.assertExist(data.restaurantId, "restaurant")
    ]);

    // 3. Compute ETA
    const eta = this.calcEta(data.totalItems);

    // 4. Insert into DB
    const created = await prismaClient.order.create({
      data: {
        customerId: data.customerId,
        restaurantId: data.restaurantId,
        totalItems: data.totalItems,
        etaMinutes: eta
      },
      include: {
        customer: true,
        restaurant: true
      }
    });

    return toOrderResponse(created);
  }

  static async getByCustomer(customerId: number): Promise<OrderResponse[]> {
    await this.assertExist(customerId, "customer");
    return this.loadOrders({ customerId });
  }

  static async getByRestaurant(restaurantId: number): Promise<OrderResponse[]> {
    await this.assertExist(restaurantId, "restaurant");
    return this.loadOrders({ restaurantId });
  }

  static async getAll(): Promise<OrderResponse[]> {
    return this.loadOrders({});
  }
}
