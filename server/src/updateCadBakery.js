import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.store.update({
    where: { id: 'st_cad' },
    data: {
      name: 'CAD Bakery',
      logoUrl: '/cad-bakery-logo.png',
    },
  });

  const updatedListings = await prisma.listing.updateMany({
    where: { storeId: 'st_cad' },
    data: {
      storeName: 'CAD Bakery',
    },
  });

  console.log(`✅ Updated st_cad store name to "CAD Bakery" and logoUrl to "/cad-bakery-logo.png"`);
  console.log(`✅ Updated ${updatedListings.count} listings to storeName "CAD Bakery"`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
