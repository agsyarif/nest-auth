import { Global, Module } from '@nestjs/common';
import { AccessControlService } from './access-control.service';
import { AccessControlController } from './access-control.controller';
import { RolesController } from './roles/roles.controller';
import { RolesService } from './roles/roles.service';
import { PermissionsController } from './permissions/permissions.controller';
import { PermissionsService } from './permissions/permissions.service';

@Global()
@Module({
  imports: [],
  providers: [AccessControlService, RolesService, PermissionsService],
  exports: [AccessControlService],
  controllers: [AccessControlController, RolesController, PermissionsController],
})
export class AccessControlModule {}
