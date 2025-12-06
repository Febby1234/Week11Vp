import express from 'express'
import { CustomerController } from '../controllers/customer-controller'
import { RestaurantController } from '../controllers/restaurant-controller'
import { OrderController } from '../controllers/order-controller'

export const publicRouter = express.Router()

// Customer Routes
publicRouter.post("/customers", CustomerController.create)
publicRouter.get("/customers/:id", CustomerController.getById)
publicRouter.patch("/customers/:id", CustomerController.update)
publicRouter.delete("/customers/:id", CustomerController.delete)

// Restaurant Routes
publicRouter.post("/restaurants", RestaurantController.create)
publicRouter.get("/restaurants", RestaurantController.getAll)
publicRouter.get("/restaurants/status", RestaurantController.getByStatus) 
publicRouter.get("/restaurants/:id", RestaurantController.getById)
publicRouter.patch("/restaurants/:id", RestaurantController.update)
publicRouter.delete("/restaurants/:id", RestaurantController.delete)

// Order Routes
publicRouter.post("/orders", OrderController.create)
publicRouter.get("/orders", OrderController.getAll)
publicRouter.get("/orders/customer/:customerId", OrderController.getByCustomer)
publicRouter.get("/orders/restaurant/:restaurantId", OrderController.getByRestaurant)