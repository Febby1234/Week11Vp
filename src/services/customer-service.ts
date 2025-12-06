import { prismaClient } from "../utils/database-util"
import { ResponseError } from "../error/response-error"
import { Validation } from "../validations/validation"
import { CustomerValidation } from "../validations/customer-validation"
import {
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerResponse,
  toCustomerResponse
} from "../models/customer-model"

export class CustomerService {
  static async create(request: CreateCustomerRequest): Promise<CustomerResponse> {
    const validated = Validation.validate(CustomerValidation.CREATE, request)
    
    const customer = await prismaClient.customer.create({
      data: validated
    })
    
    return toCustomerResponse(customer)
  }

  static async getById(id: number): Promise<CustomerResponse> {
    const customer = await prismaClient.customer.findUnique({
      where: { id }
    })
    
    if (!customer) {
      throw new ResponseError(404, "Customer not found")
    }
    
    return toCustomerResponse(customer)
  }

  static async update(id: number, request: UpdateCustomerRequest): Promise<CustomerResponse> {
    const validated = Validation.validate(CustomerValidation.UPDATE, request)
    
    const customer = await prismaClient.customer.update({
      where: { id },
      data: validated
    })
    
    return toCustomerResponse(customer)
  }

  static async delete(id: number): Promise<void> {
    await prismaClient.customer.delete({
      where: { id }
    })
  }
}