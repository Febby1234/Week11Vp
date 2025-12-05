import express from 'express'
import { CustomerController } from '../controllers/customer-controller'
import { RestaurantController } from '../controllers/restaurant-controller'
import { OrderController } from '../controllers/order-controller'

export const publicRouter = express.Router()