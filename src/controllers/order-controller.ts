import { Request, Response, NextFunction } from "express"
import { OrderService } from "../services/order-service"
import { CreateOrderRequest } from "../models/order-model"

export class OrderController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateOrderRequest = req.body
      const response = await OrderService.create(request)
      
      res.status(201).json({
        success: true,
        data: response
      })
    } catch (error) {
      next(error)
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await OrderService.getAll()
      
      res.status(200).json({
        success: true,
        data: response
      })
    } catch (error) {
      next(error)
    }
  }

  static async getByCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = parseInt(req.params.customerId)
      const response = await OrderService.getByCustomer(customerId)
      
      res.status(200).json({
        success: true,
        data: response
      })
    } catch (error) {
      next(error)
    }
  }

  static async getByRestaurant(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = parseInt(req.params.restaurantId)
      const response = await OrderService.getByRestaurant(restaurantId)
      
      res.status(200).json({
        success: true,
        data: response
      })
    } catch (error) {
      next(error)
    }
  }
}