import { prismaClient } from "../utils/databse-util";
import { ResponseError } from "../error/response-error";
import { Validation } from "../validations/validation";
import { RestaurantValidation } from "../validations/restaurant-validation";
import {
  CreateRestaurantRequest,
  UpdateRestaurantRequest,
  RestaurantResponse,
  toRestaurantResponse
} from "../models/restaurant-model";

export class RestaurantService {
  private static validate(schema: any, data: any) {
    return Validation.validate(schema, data);
  }

  private static async ensureExists(id: number) {
    const result = await prismaClient.restaurant.findUnique({ where: { id } });
    if (!result) throw new ResponseError(404, "Restaurant not found");
    return result;
  }

  static async create(request: CreateRestaurantRequest): Promise<RestaurantResponse> {
    const payload = this.validate(RestaurantValidation.CREATE, request);

    const created = await prismaClient.restaurant.create({
      data: {
        name: payload.name,
        details: payload.details ?? null,
        active: payload.active ?? true
      }
    });

    return toRestaurantResponse(created);
  }

  static async getAll(): Promise<RestaurantResponse[]> {
    const list = await prismaClient.restaurant.findMany();
    return list.map(toRestaurantResponse);
  }

  static async getById(id: number): Promise<RestaurantResponse> {
    const restaurant = await this.ensureExists(id);
    return toRestaurantResponse(restaurant);
  }

  static async getByStatus(active: boolean): Promise<RestaurantResponse[]> {
    const list = await prismaClient.restaurant.findMany({
      where: { active }
    });

    return list.map(toRestaurantResponse);
  }

  static async update(id: number, request: UpdateRestaurantRequest): Promise<RestaurantResponse> {
    await this.ensureExists(id);

    const payload = this.validate(RestaurantValidation.UPDATE, request);

    const updated = await prismaClient.restaurant.update({
      where: { id },
      data: {
        name: payload.name,
        details: payload.details,
        active: payload.active
      }
    });

    return toRestaurantResponse(updated);
  }

  static async delete(id: number): Promise<void> {
    await this.ensureExists(id);
    await prismaClient.restaurant.delete({ where: { id } });
  }
}