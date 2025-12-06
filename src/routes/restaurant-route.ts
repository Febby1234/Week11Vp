import express from "express";
import { prisma } from "../utils/prismaClient";

const router = express.Router();

// Create restaurant
router.post("/", async (req, res) => {
  try {
    const { name, description, isOpen } = req.body;
    const r = await prisma.restaurant.create({
      data: {
        name,
        description,
        isOpen: typeof isOpen === "boolean" ? isOpen : true,
      },
    });
    res.status(201).json(r);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Get all
router.get("/", async (req, res) => {
  const { opened } = req.query;
  if (opened === "true" || opened === "false") {
    const isOpen = opened === "true";
    const rs = await prisma.restaurant.findMany({ where: { isOpen } });
    return res.json(rs);
  }
  const rs = await prisma.restaurant.findMany();
  res.json(rs);
});

// Get single
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const r = await prisma.restaurant.findUnique({ where: { id } });
  if (!r) return res.status(404).json({ error: "Restaurant not found" });
  res.json(r);
});

// Update name
router.patch("/:id/name", async (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body;
  const updated = await prisma.restaurant.update({
    where: { id },
    data: { name },
  });
  res.json(updated);
});

// Update description
router.patch("/:id/description", async (req, res) => {
  const id = Number(req.params.id);
  const { description } = req.body;
  const updated = await prisma.restaurant.update({
    where: { id },
    data: { description },
  });
  res.json(updated);
});

// Update open/close status
router.patch("/:id/status", async (req, res) => {
  const id = Number(req.params.id);
  const { isOpen } = req.body;
  const updated = await prisma.restaurant.update({
    where: { id },
    data: { isOpen },
  });
  res.json(updated);
});

// Delete
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  await prisma.restaurant.delete({ where: { id } });
  res.json({ ok: true });
});

export default router;
