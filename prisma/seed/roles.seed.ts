import { PrismaClient } from "@prisma/client"
import { roles } from "./json/roles";
import { AccessControlService } from "../../src/access-control/access-control.service";
import { __ } from "../../src/common/enums/permissions.enum";
const prisma = new PrismaClient()
const accessControl = new AccessControlService(prisma)

export async function roleSeed() {
  await prisma.role.createMany({
    data: roles,
    skipDuplicates: true,
  });

  console.log('Seeding roles is completed');

  const permissions = await prisma.permission.findMany({
    where: {
      name: {
        contains: 'manage',
      },
    },
  });

  const managePermissions = permissions.find(permission => permission.name === __.M_PERMISSIONS).id;
  const manageUsers = permissions.find(permission => permission.name === __.M_USERS).id
  const manageRoles = permissions.find(role => role.name === __.M_ROLES).id
  const manageArticles = permissions.find(article => article.name === __.M_ARTICLES).id

  // superadmin - admin
  await accessControl.assignPermissionsToRole(1, [managePermissions, manageUsers, manageRoles, manageArticles])
  await accessControl.assignPermissionsToRole(2, [managePermissions, manageUsers, manageRoles])

  console.log('Assignin permissions to roles is completed');
}