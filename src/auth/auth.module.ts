import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '../jwt/jwt.module';
import { CommonModule } from '../common/common.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    // CacheModule.register(),
    UserModule,
    JwtModule,
    CommonModule,
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}