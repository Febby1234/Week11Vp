import { prisma } from "../utils/prismaClient";

async function main() {
  // clear
  await prisma.order.deleteMany();
  await prisma.customerRestaurant.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.restaurant.deleteMany();

  // customers
  const c1 = await prisma.customer.create({ data: { name: "Alice", phone: "0811000001" }});
  const c2 = await prisma.customer.create({ data: { name: "Budi", phone: "0811000002" }});
  const c3 = await prisma.customer.create({ data: { name: "Citra", phone: "0811000003" }});

  // restaurants
  const r1 = await prisma.restaurant.create({ data: { name: "Warung Makan A", description: "Masakan rumahan", isOpen: true }});
  const r2 = await prisma.restaurant.create({ data: { name: "Kedai B", description: "Kopi & roti", isOpen: false }});
  const r3 = await prisma.restaurant.create({ data: { name: "Resto C", description: "Seafood", isOpen: true }});

  // pivot relationships (customerRestaurant)
  await prisma.customerRestaurant.createMany({
    data: [
      { customerId: c1.id, restaurantId: r1.id },
      { customerId: c1.id, restaurantId: r3.id },
      { customerId: c2.id, restaurantId: r2.id },
      { customerId: c3.id, restaurantId: r1.id },
    ],
    skipDuplicates: true,
  });

  // orders
  const now = new Date();
  function etaFor(items: number, base: Date) {
    const minutes = items * 10 + 10;
    return new Date(base.getTime() + minutes * 60000);
  }

  await prisma.order.createMany({
    data: [
      { customerId: c1.id, restaurantId: r1.id, items: 2, createdAt: new Date(now.getTime() - 1000 * 60 * 60), eta: etaFor(2, new Date(now.getTime() - 1000 * 60 * 60)) },
      { customerId: c1.id, restaurantId: r3.id, items: 1, createdAt: new Date(now.getTime() - 1000 * 60 * 30), eta: etaFor(1, new Date(now.getTime() - 1000 * 60 * 30)) },
      { customerId: c2.id, restaurantId: r2.id, items: 5, createdAt: new Date(now.getTime() - 1000 * 60 * 20), eta: etaFor(5, new Date(now.getTime() - 1000 * 60 * 20)) },
      { customerId: c3.id, restaurantId: r1.id, items: 3, createdAt: new Date(now.getTime() - 1000 * 60 * 10), eta: etaFor(3, new Date(now.getTime() - 1000 * 60 * 10)) },
      { customerId: c2.id, restaurantId: r1.id, items: 4, createdAt: now, eta: etaFor(4, now) },
    ],
  });

  console.log("Seed finished");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
