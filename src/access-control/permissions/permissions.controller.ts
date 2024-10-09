import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { __ } from '../../common/enums/permissions.enum';
import { AccessControlService } from '../access-control.service';
import { AssignToUsersDto } from '../dtos/assign-to-users.dto';
import { AssignToRolesDto } from '../dtos/assign-to-roles.dto';
import { AuthGuard } from '../../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('access-control/permissions')
export class PermissionsController {
  constructor(
    private readonly permissionsService: PermissionsService,
    private readonly accessControlService: AccessControlService
  ) {}

  @Get('/')
  @Permissions(__.V_PERMISSIONS, __.M_PERMISSIONS)
  async getPermissions(): Promise<any> {
    return this.permissionsService.list()
  }

  @Post('/')
  @Permissions(__.C_PERMISSIONS, __.M_PERMISSIONS)
  async createPermissions(@Body() body: any): Promise<any> {
    return this.permissionsService.create(body)
  }

  @Post('/bulk')
  @Permissions(__.C_PERMISSIONS, __.M_PERMISSIONS)
  async bulkCreatePermissions(@Body() body: any): Promise<any> {
    return this.permissionsService.bulkCreate(body)
  }

  @Get('/:id')
  @Permissions(__.V_PERMISSION, __.M_PERMISSIONS)
  async getPermission(@Param('id') permissionId: number): Promise<any> {
    return this.permissionsService.show(permissionId)
  }

  @Put('/:id')
  @Permissions(__.U_PERMISSIONS, __.M_PERMISSIONS)
  async updatePermissions(@Param('id') permissionId: number, @Body() body: any): Promise<any> {
    return this.permissionsService.update(permissionId, body)
  }

  @Delete('/:id')
  @Permissions(__.D_PERMISSIONS, __.M_PERMISSIONS)
  async deletePermissions(@Param('id') permissionId: number): Promise<any> {
    return this.permissionsService.delete(permissionId)
  }

  @Post(':id/users')
  @Permissions(__.A_PERMISSION_TO_USERS, __.M_PERMISSIONS)
  async assignPermissionToUsers(@Param('id') permissionId: number, @Body() data: AssignToUsersDto): Promise<any> {
    return this.accessControlService.assignPermissionToUsers(permissionId, data.userIds);
  }

  @Post(':id/roles')
  @Permissions(__.A_PERMISSION_TO_ROLES, __.M_PERMISSIONS)
  async assigPermissionToRoles(@Param('id') permissionId: number, @Body() data: AssignToRolesDto): Promise<any> {
    return this.accessControlService.assignPermissionToRoles(permissionId, data.roleIds)
  }
}
