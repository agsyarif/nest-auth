import { Global, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { PrismaModule } from '../prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
