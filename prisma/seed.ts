import { PrismaClient } from '@prisma/client';

export async function seed() {
  const client = new PrismaClient();
  await client.user.create({
    data: {
      username: 'finaritra',
      email: 'finaritra@gmail.com',
      password: 'finaritra21',
    },
  });
}
