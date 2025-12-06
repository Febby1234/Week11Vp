import { Customer } from "../../generated/prisma";

export interface CustomerResponse {
  id: number;
  fullName: string;
  phone: string;
  joinedAt: Date;
}

export interface CreateCustomerRequest {
  fullName: string;
  phone: string;
}

export function toCustomerResponse(customer: Customer): CustomerResponse {
  return {
    id: customer.id,
    fullName: customer.fullName,
    phone: customer.phone,
    joinedAt: customer.joinedAt
  };
}