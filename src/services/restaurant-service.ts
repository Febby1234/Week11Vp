import { prismaClient } from "../utils/database-util"
import { ResponseError } from "../error/response-error"
import { Validation } from "../validations/validation"
import { RestaurantValidation } from "../validations/restaurant-validation"
import {
  CreateRestaurantRequest,
  UpdateRestaurantRequest,
  RestaurantResponse,
  toRestaurantResponse
} from "../models/restaurant-model"

export class RestaurantService {
  static async create(request: CreateRestaurantRequest): Promise<RestaurantResponse> {
    const validated = Validation.validate(RestaurantValidation.CREATE, request)
    
    const restaurant = await prismaClient.restaurant.create({
      data: validated
    })
    
    return toRestaurantResponse(restaurant)
  }

  static async getAll(): Promise<RestaurantResponse[]> {
    const restaurants = await prismaClient.restaurant.findMany()
    return restaurants.map(toRestaurantResponse)
  }

  static async getById(id: number): Promise<RestaurantResponse> {
    const restaurant = await prismaClient.restaurant.findUnique({
      where: { id }
    })
    
    if (!restaurant) {
      throw new ResponseError(404, "Restaurant not found")
    }
    
    return toRestaurantResponse(restaurant)
  }

  static async getByStatus(isOpen: boolean): Promise<RestaurantResponse[]> {
    const restaurants = await prismaClient.restaurant.findMany({
      where: { isOpen }
    })
    return restaurants.map(toRestaurantResponse)
  }

  static async update(id: number, request: UpdateRestaurantRequest): Promise<RestaurantResponse> {
    const validated = Validation.validate(RestaurantValidation.UPDATE, request)
    
    const restaurant = await prismaClient.restaurant.update({
      where: { id },
      data: validated
    })
    
    return toRestaurantResponse(restaurant)
  }

  static async delete(id: number): Promise<void> {
    await prismaClient.restaurant.delete({
      where: { id }
    })
  }
}