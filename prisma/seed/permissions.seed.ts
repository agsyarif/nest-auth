import { PrismaClient } from '@prisma/client';
import { permissions } from './json/permissions';

const prisma = new PrismaClient();

export async function PermissionsSeed() { 
  await prisma.permission.createMany({
    data: permissions,
    skipDuplicates: true,
  });

  console.log('Seeding permissions is completed');
}