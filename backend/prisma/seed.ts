import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const electronics = await prisma.category.upsert({
    where: { id: 1 },
    update: {},
    create: { name: 'Eletrônicos' },
  });

  const clothing = await prisma.category.upsert({
    where: { id: 2 },
    update: {},
    create: { name: 'Roupas' },
  });

  await prisma.product.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Notebook',
      description: 'Notebook 15 polegadas',
      price: 3499.99,
      categoryId: electronics.id,
    },
  });

  await prisma.product.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Camiseta',
      description: 'Camiseta básica algodão',
      price: 59.9,
      categoryId: clothing.id,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
