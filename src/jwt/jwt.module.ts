import { Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    CommonModule
  ],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
