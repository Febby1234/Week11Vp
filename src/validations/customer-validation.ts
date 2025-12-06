import { z, ZodType } from "zod"

export class CustomerValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(1, "Name cannot be empty"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits")
  })

  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(1, "Name cannot be empty").optional(),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits").optional()
  })
}