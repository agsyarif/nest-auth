import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { CommonModule } from '../common/common.module';
import { JwtModule } from '../jwt/jwt.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    CommonModule,
    UploadModule
  ],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
