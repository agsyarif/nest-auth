import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UploadModule } from '../upload/upload.module';

@Global()
@Module({
  imports: [
    UploadModule
  ],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
