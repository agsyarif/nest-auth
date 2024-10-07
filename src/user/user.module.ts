import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { CommonModule } from '../common/common.module';
import { JwtModule } from '../jwt/jwt.module';
import { UploadModule } from '../upload/upload.module';
import { AccessControlModule } from '../access-control/access-control.module';

@Module({
  imports: [
    CommonModule,
    UploadModule,
    AccessControlModule
  ],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
