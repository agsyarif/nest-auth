import { Module, Global } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Global()
@Module({
  providers: [
    {
      provide: PrismaClient,
      useClass: PrismaClient,
    },
  ],
  exports: [PrismaClient],
})
export class PrismaModule {}