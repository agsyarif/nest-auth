import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function roleSeed() {
  await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin'
    }
  });
  await prisma.role.upsert({
    where: { name: 'member' },
    update: {},
    create: {
      name: 'member'
    }
  });
}