import { z, ZodType } from "zod"

export class OrderValidation {
  static readonly CREATE: ZodType = z.object({
    customerId: z.number().int().positive("Customer ID must be positive"),
    restaurantId: z.number().int().positive("Restaurant ID must be positive"),
    itemCount: z.number().int().positive("Item count must be positive")
  })
}