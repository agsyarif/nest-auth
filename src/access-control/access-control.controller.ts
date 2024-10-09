import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { AccessControlService } from './access-control.service';
import { __ } from '../common/enums/permissions.enum';

@UseGuards(AuthGuard)
@Controller('access-control')
export class AccessControlController {

  constructor(
    private readonly accessControlService: AccessControlService
  ) {}

  @Get('users/:id')
  @Permissions(__.V_USER_ACCESS, __.M_USERS)
  async getUserRoles(@Param('id') userId: number): Promise<any> {
    return this.accessControlService.usersWithRoleAndPermission(userId);
  }

  // ASSIGN
  @Post('users/:id/permissions')
  @Permissions(__.A_USER_PERMISSIONS, __.M_USERS)
  async assignPermissionToUser(@Param('id') userId: number, @Body() data: any): Promise<any> {
    return this.accessControlService.assignPermisionsToUser(userId, data.permissionIds)
  }

  @Post('users/:id/roles')
  @Permissions(__.A_USER_ROLES, __.M_USERS)
  async assignRoleToUser(@Param('id') userId: number, @Body() data: any): Promise<any> {
    return this.accessControlService.assignRolesToUser(userId, data.roleIds)
  }

}
