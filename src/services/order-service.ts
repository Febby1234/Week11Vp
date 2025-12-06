import { prismaClient } from "../utils/database-util"
import { ResponseError } from "../error/response-error"
import { Validation } from "../validations/validation"
import { OrderValidation } from "../validations/order-validation"
import {
  CreateOrderRequest,
  OrderResponse,
  toOrderResponse
} from "../models/order-model"

export class OrderService {
  static async create(request: CreateOrderRequest): Promise<OrderResponse> {
    const validated = Validation.validate(OrderValidation.CREATE, request)
    
    // Check if customer exists
    const customer = await prismaClient.customer.findUnique({
      where: { id: validated.customerId }
    })
    if (!customer) {
      throw new ResponseError(404, "Customer not found")
    }
    
    // Check if restaurant exists
    const restaurant = await prismaClient.restaurant.findUnique({
      where: { id: validated.restaurantId }
    })
    if (!restaurant) {
      throw new ResponseError(404, "Restaurant not found")
    }
    
    // Calculate estimated arrival time: (itemCount * 10) + 10 minutes for delivery
    const estimatedArrivalTime = (validated.itemCount * 10) + 10
    
    const order = await prismaClient.order.create({
      data: {
        customerId: validated.customerId,
        restaurantId: validated.restaurantId,
        itemCount: validated.itemCount,
        estimatedArrivalTime
      },
      include: {
        customer: true,
        restaurant: true
      }
    })
    
    return toOrderResponse(order)
  }

  static async getByCustomer(customerId: number): Promise<OrderResponse[]> {
    const orders = await prismaClient.order.findMany({
      where: { customerId },
      include: {
        customer: true,
        restaurant: true
      }
    })
    
    return orders.map(toOrderResponse)
  }

  static async getByRestaurant(restaurantId: number): Promise<OrderResponse[]> {
    const orders = await prismaClient.order.findMany({
      where: { restaurantId },
      include: {
        customer: true,
        restaurant: true
      }
    })
    
    return orders.map(toOrderResponse)
  }

  static async getAll(): Promise<OrderResponse[]> {
    const orders = await prismaClient.order.findMany({
      include: {
        customer: true,
        restaurant: true
      }
    })
    
    return orders.map(toOrderResponse)
  }
}