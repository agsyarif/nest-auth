import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { RolesService } from './roles.service';
import { AuthGuard } from '../../auth/auth.guard';
import { __ } from '../../common/enums/permissions.enum';
import { AccessControlService } from '../access-control.service';
import { AssignToUsersDto } from '../dtos/assign-to-users.dto';
import { AssignPermissionsDto } from '../dtos/assign-permissions.dto';

@UseGuards(AuthGuard)
@Controller('access-control/roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly accessControlService: AccessControlService
  ) {}

  @Get('/')
  @Permissions(__.V_ROLES, __.M_ROLES)
  async getRoles(): Promise<any> {
    return this.rolesService.list()
  }

  @Post('/')
  @Permissions(__.C_ROLES, __.M_ROLES)
  async createRole(@Body() body: any): Promise<any> {
    return this.rolesService.create(body);
  }

  @Get('/:id')
  @Permissions(__.V_ROLE, __.M_ROLES)
  async getRole(@Param('id') roleId: number): Promise<any> {
    return this.rolesService.show(roleId)
  }

  @Put('/:id')
  @Permissions(__.U_ROLES, __.M_ROLES)
  async updateRole(@Param('id') roleId: number, @Body() body: any): Promise<any> {
    return this.rolesService.update(roleId, body)
  }

  @Delete('/:id')
  @Permissions(__.D_ROLES, __.M_ROLES)
  async deleteRole(@Param('id') roleId: number): Promise<any> {
    return this.rolesService.delete(roleId)
  }

  @Get('/:id/permissions')
  @Permissions(__.V_ROLE_PERMISSIONS, __.M_ROLES)
  async getRolePermissions(@Param('id') roleId: string): Promise<any> {
    return this.rolesService.roleWithPermissions()
  }

  @Post(':id/permissions')
  @Permissions(__.A_ROLE_PERMISSIONS, __.M_ROLES)
  async assignPermissionsToRole(@Param('id') roleId: number, @Body() data: AssignPermissionsDto): Promise<any> {
    return this.accessControlService.assignPermissionsToRole(roleId, data.permissionIds)
  }

  @Post(':id/users')
  @Permissions(__.A_ROLE_TO_USERS, __.M_ROLES)
  async assigRoleToUsers(@Param('id') roleId: number, @Body() data: AssignToUsersDto): Promise<any> {
    return this.accessControlService.assignRoleToUsers(roleId, data.userIds);
  }
}
