import { Restaurant } from "../../generated/prisma";

export interface RestaurantResponse {
  id: number;
  name: string;
  details: string | null;
  active: boolean;
  createdAt: Date;
}

export interface CreateRestaurantRequest {
  name: string;
  details?: string;
  active?: boolean;
}

export interface UpdateRestaurantRequest {
  name?: string;
  details?: string;
  active?: boolean;
}

export function toRestaurantResponse(restaurant: Restaurant): RestaurantResponse {
  return {
    id: restaurant.id,
    name: restaurant.name,
    details: restaurant.details,
    active: restaurant.active,
    createdAt: restaurant.createdAt
  };
}
