import { PrismaClient } from "@prisma/client"
import { roleSeed } from "./roles.seed"
const prisma = new PrismaClient()

async function main() {
  await roleSeed()
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