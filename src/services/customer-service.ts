import { prismaClient } from "../utils/databse-util";
import { ResponseError } from "../error/response-error";
import { Validation } from "../validations/validation";
import { CustomerValidation } from "../validations/customer-validation";
import {
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerResponse,
  toCustomerResponse
} from "../models/customer-model";

export class CustomerService {
  private static async validateAndExist(id: number) {
    const data = await prismaClient.customer.findUnique({ where: { id } });
    if (!data) throw new ResponseError(404, "Customer not found");
    return data;
  }

  private static ensureValid(schema: any, payload: any) {
    return Validation.validate(schema, payload);
  }

  private static async saveCustomer(id: number | null, data: any) {
    if (id === null) {
      return prismaClient.customer.create({ data });
    }
    return prismaClient.customer.update({ where: { id }, data });
  }

  static async create(request: CreateCustomerRequest): Promise<CustomerResponse> {
    const payload = this.ensureValid(CustomerValidation.CREATE, request);

    const saved = await this.saveCustomer(null, payload);

    return toCustomerResponse(saved);
  }

  static async getById(id: number): Promise<CustomerResponse> {
    const customer = await this.validateAndExist(id);
    return toCustomerResponse(customer);
  }

  static async update(id: number, request: UpdateCustomerRequest): Promise<CustomerResponse> {
    await this.validateAndExist(id);

    const payload = this.ensureValid(CustomerValidation.UPDATE, request);

    const updated = await this.saveCustomer(id, payload);

    return toCustomerResponse(updated);
  }

  static async delete(id: number): Promise<void> {
    await this.validateAndExist(id);
    await prismaClient.customer.delete({ where: { id } });
  }
}