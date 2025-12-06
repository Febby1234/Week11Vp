import { Request, Response, NextFunction } from "express"
import { CustomerService } from "../services/customer-service"
import { CreateCustomerRequest, UpdateCustomerRequest } from "../models/customer-model"

export class CustomerController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateCustomerRequest = req.body
      const response = await CustomerService.create(request)
      
      res.status(201).json({
        success: true,
        data: response
      })
    } catch (error) {
      next(error)
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id)
      const response = await CustomerService.getById(id)
      
      res.status(200).json({
        success: true,
        data: response
      })
    } catch (error) {
      next(error)
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id)
      const request: UpdateCustomerRequest = req.body
      const response = await CustomerService.update(id, request)
      
      res.status(200).json({
        success: true,
        data: response
      })
    } catch (error) {
      next(error)
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id)
      await CustomerService.delete(id)
      
      res.status(200).json({
        success: true,
        message: "Customer deleted successfully"
      })
    } catch (error) {
      next(error)
    }
  }
}