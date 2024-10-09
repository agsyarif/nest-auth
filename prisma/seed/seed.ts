import { PrismaClient } from "@prisma/client"
import { roleSeed } from "./roles.seed"
import { PermissionsSeed } from "./permissions.seed"
import { usersSeed } from "./users.seed.";
const prisma = new PrismaClient()

async function main() {
  /*
    1. permission
    2. role -> include assign default permissons to role
    3. user -> include assign role to user
    .....
  */

  await PermissionsSeed();
  await roleSeed();
  await usersSeed();
}

main()
  .then(async () => [
    await prisma.$disconnect()
  ])
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })