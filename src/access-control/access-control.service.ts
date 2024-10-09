import { Injectable } from '@nestjs/common';
import { Permission, PrismaClient, Role, RolePermission, UserPermission, UserRoles } from '@prisma/client';

@Injectable()
export class AccessControlService {
  constructor(
    private readonly prisma: PrismaClient
  ) {}

  async getPermissions() : Promise<Permission[]> {
    return this.prisma.permission.findMany();
  }

  public async assignPermissionsToRole(roleId: number, permissionIds: number[]): Promise<any> {
    const permissionsData = permissionIds.map((permissionId) => ({
      roleId : Number(roleId),
      permissionId,
    }));
  
    try {
      return this.prisma.rolePermission.createMany({
        data: permissionsData,
        skipDuplicates: true,
      });
    } catch (error) {
      throw new Error(`Error assign permissions to role: ${error.message}`);
    }
  }

  public async assignRoleToUsers(roleId: number, userIds: number[]) {
    const rolesData = userIds.map((userId) => ({
      roleId : Number(roleId),
      userId,
    }));

    try {
      return this.prisma.userRoles.createMany({
        data: rolesData,
        skipDuplicates: true
      })
    } catch (error) {
      throw new Error(`Error assign role to users: ${error.message}`);
    }
  }

  public async assignPermissionToUsers(permissionId: number, userIds: number[]): Promise<any> {
    const permissionsData = userIds.map((userId) => ({
      permissionId : Number(permissionId),
      userId,
    }));
  
    try {
      return this.prisma.userPermission.createMany({
        data: permissionsData,
        skipDuplicates: true,
      });
    } catch (error) {
      throw new Error(`Error assign permission to users: ${error.message}`); 
    }
  }

  public async assignPermissionToRoles(permissionId: number, roleIds: number[]): Promise<any> {
    const permissionsData = roleIds.map((roleId) => ({
      permissionId : Number(permissionId),
      roleId,
    }));
  
    try {
      return this.prisma.rolePermission.createMany({
        data: permissionsData,
        skipDuplicates: true,
      });
    } catch (error) {
      throw new Error(`Error assign permission to roles: ${error.message}`);
      
    }
  }

  public async usersWithRoleAndPermission(userId: number) {
    return this.prisma.user.findUnique({
      where: {
        id: Number(userId)
      },
      include: {
        roles: {
          include: {
            role: true
          }
        },
        permissions: {
          include: {
            permission: true
          }
        }
      }
    })
  }

  public async assignPermisionsToUser(userId: number, permissionIds: number[]) {

    const userPermissionsData = permissionIds.map((permissionId) => ({
      userId : Number(userId),
      permissionId,
    }));

    try {
      return this.prisma.userPermission.createMany({
        data: userPermissionsData,
        skipDuplicates: true,
      });
    } catch (error) {
      throw new Error(`Error assign permissions to user: ${error.message}`);
    }

  }

  public async assignRolesToUser(userId: number, roleIds: number[]) {

    const userRolesData = roleIds.map((roleId) => ({
      userId : Number(userId),
      roleId,
    }));

   try {
    return this.prisma.userRoles.createMany({
      data: userRolesData,
      skipDuplicates: true,
    });
   } catch (error) {
    throw new Error(`Error assign roles to user: ${error.message}`);
   }

  }

  //
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
