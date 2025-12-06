import { Request, Response, NextFunction } from "express"
import { RestaurantService } from "../services/restaurant-service"
import { CreateRestaurantRequest, UpdateRestaurantRequest } from "../models/restaurant-model"

export class RestaurantController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateRestaurantRequest = req.body
      const response = await RestaurantService.create(request)
      
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
      const response = await RestaurantService.getAll()
      
      res.status(200).json({
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
      const response = await RestaurantService.getById(id)
      
      res.status(200).json({
        success: true,
        data: response
      })
    } catch (error) {
      next(error)
    }
  }

  static async getByStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const isOpen = req.query.isOpen === 'true'
      const response = await RestaurantService.getByStatus(isOpen)
      
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
      const request: UpdateRestaurantRequest = req.body
      const response = await RestaurantService.update(id, request)
      
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
      await RestaurantService.delete(id)
      
      res.status(200).json({
        success: true,
        message: "Restaurant deleted successfully"
      })
    } catch (error) {
      next(error)
    }
  }
}