import express from "express";
import { prisma } from "../utils/prismaClient";

const router = express.Router();

// Create customer
router.post("/", async (req, res) => {
  try {
    const { name, phone } = req.body;
    const customer = await prisma.customer.create({
      data: { name, phone },
    });
    res.status(201).json(customer);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Get all customers
router.get("/", async (req, res) => {
  const customers = await prisma.customer.findMany();
  res.json(customers);
});

// Get single customer
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const customer = await prisma.customer.findUnique({ where: { id } });
  if (!customer) return res.status(404).json({ error: "Customer not found" });
  res.json(customer);
});

// Update name
router.patch("/:id/name", async (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body;
  const updated = await prisma.customer.update({
    where: { id },
    data: { name },
  });
  res.json(updated);
});

// Update phone
router.patch("/:id/phone", async (req, res) => {
  const id = Number(req.params.id);
  const { phone } = req.body;
  const updated = await prisma.customer.update({
    where: { id },
    data: { phone },
  });
  res.json(updated);
});

// Delete
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  await prisma.customer.delete({ where: { id } });
  res.json({ ok: true });
});

export default router;
