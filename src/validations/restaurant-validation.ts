import { z, ZodType } from "zod"

export class RestaurantValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(1, "Name cannot be empty"),
    description: z.string().optional(),
    isOpen: z.boolean().optional()
  })

  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(1, "Name cannot be empty").optional(),
    description: z.string().optional(),
    isOpen: z.boolean().optional()
  })
}