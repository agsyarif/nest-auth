import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt";
import dayjs from "dayjs";
import { AccessControlService } from "../../src/access-control/access-control.service";
import { Role } from "../../src/common/enums/roles.enum";
const prisma = new PrismaClient()
const accessControl = new AccessControlService(prisma)

export async function usersSeed() {
  const passwordHash = (password: string) => hash(password, 10);
  const roles = await prisma.role.findMany({
    where: {
      name: {
        in: ['super admin', 'admin', 'customer'],
      },
    },
  });

  let passwordHashed = await passwordHash('Superadmin@2020');
  const superadmin = {
    name: 'superadmin',
    email: 'superadmin@gmail.com',
    password: passwordHashed,
    lastPassword: passwordHashed,
    passwordUpdatedAt: dayjs().unix(),
    confirmed: true,
    emailVerifiedAt: null,
    phone: '',
    userAvatarImage: '',
    version: 0,
  }

  const newSuperadmin = await prisma.user.upsert({
    where: { email: superadmin.email },
    update: {},
    create: superadmin
  })

  await accessControl.assignRoleToUser(
    newSuperadmin.id,
    roles.find(role => role.name === Role.SuperAdmin).id
  )
  
  passwordHashed = await passwordHash('Admin@2020');
  const admin = {
    name: 'admin',
    email: 'admin@gmail.com',
    password: passwordHashed,
    lastPassword: passwordHashed,
    passwordUpdatedAt: dayjs().unix(),
    confirmed: true,
    emailVerifiedAt: null,
    phone: '',
    userAvatarImage: '',
    version: 0,
  }
  const newAdmin = await prisma.user.upsert({
    where: { email: admin.email },
    update: {},
    create: admin
  })
  await accessControl.assignRoleToUser(
    newAdmin.id,
    roles.find(role => role.name === Role.Admin).id
  )
  
  passwordHashed = await passwordHash('Password@2020');
  const customer = {
    name: 'customer',
    email: 'customer@gmail.com',
    password: passwordHashed,
    lastPassword: passwordHashed,
    passwordUpdatedAt: dayjs().unix(),
    confirmed: true,
    emailVerifiedAt: null,
    phone: '',
    userAvatarImage: '',
    version: 0,
  }
  const newCustomer = await prisma.user.upsert({
    where: { email: customer.email },
    update: {},
    create: customer
  })
  await accessControl.assignRoleToUser(
    newCustomer.id,
    roles.find(role => role.name === Role.Customer).id
  )

  console.log('Seeding users is completed');
}