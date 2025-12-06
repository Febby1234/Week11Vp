import express from "express";
import { prisma } from "../utils/prismaClient";

const router = express.Router();

/**
 * Helper to compute ETA:
 * ETA = createdAt + (items * 10 minutes) + 10 minutes delivery
 */
function computeEta(createdAt: Date, items: number) {
  const minutes = items * 10 + 10;
  return new Date(createdAt.getTime() + minutes * 60 * 1000);
}

// Create order
router.post("/", async (req, res) => {
  try {
    const { customerId, restaurantId, items } = req.body;
    if (!customerId || !restaurantId || !items) {
      return res.status(400).json({ error: "customerId, restaurantId, items required" });
    }

    // check exist
    const cust = await prisma.customer.findUnique({ where: { id: Number(customerId) }});
    const rest = await prisma.restaurant.findUnique({ where: { id: Number(restaurantId) }});
    if (!cust || !rest) return res.status(400).json({ error: "invalid customerId or restaurantId" });

    const createdAt = new Date();
    const eta = computeEta(createdAt, Number(items));

    const order = await prisma.order.create({
      data: {
        customerId: Number(customerId),
        restaurantId: Number(restaurantId),
        items: Number(items),
        createdAt,
        eta,
      },
    });

    res.status(201).json(order);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Get all orders / filters
router.get("/", async (req, res) => {
  const { customerId, restaurantId, from, to } = req.query;

  const where: any = {};
  if (customerId) where.customerId = Number(customerId);
  if (restaurantId) where.restaurantId = Number(restaurantId);
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(String(from));
    if (to) where.createdAt.lte = new Date(String(to));
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  res.json(orders);
});

// Get order by id
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

export default router;
