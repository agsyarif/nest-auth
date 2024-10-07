import { Injectable } from '@nestjs/common';
import { PrismaClient, RolePermission, UserPermission, UserRoles } from '@prisma/client';

@Injectable()
export class AccessControlService {
  constructor(
    private readonly prisma: PrismaClient
  ) {}

  async assignPermissionToRole(roleId: number, permissionId: number): Promise<RolePermission> {
    return this.prisma.rolePermission.create({
      data: {
        roleId,
        permissionId,
      },
    });
  }

  async assignRoleToUser(userId: number, roleId: number): Promise<UserRoles> {
    return this.prisma.userRoles.create({
      data: {
        userId,
        roleId,
      },
    });
  }

  async assignPermissionToUser(userId: number, permissionId: number): Promise<UserPermission> {
    return this.prisma.userPermission.create({
      data: {
        userId,
        permissionId,
      },
    });
  }

  async userHasPermission(userId: number, permissionName: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },  // Akses permission dari role
              },
            },
          },
        },
        permissions: {
          include: {
            permission: true
          }
        },
      },
    });

    console.log(userId);
    console.log(permissionName);
    

    // Mengakses permissions dari role
    const hasRolePermission = user.roles.some(userRole =>
      userRole.role.permissions.some(RolePermission => RolePermission.permission.name === permissionName) // Mengakses 'name'
    );

    // Mengakses permissions dari user secara langsung
    const hasUserPermission = user.permissions.some(RolePermission => RolePermission.permission.name === permissionName);

    // Cek apakah user memiliki permission dari role atau langsung
    return hasRolePermission || hasUserPermission;

  }
}
