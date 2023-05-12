import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function seed() {
  const user = await prisma.user.upsert({
    where: { email: 'test@email.com' },
    create: {
      email: 'test@email.com',
      passwordHash: await argon2.hash('password123'),
    },
    update: {},
  });
}
seed()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
