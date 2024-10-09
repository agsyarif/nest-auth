import { Injectable } from '@nestjs/common';
import { PrismaClient, Role } from '@prisma/client';

@Injectable()
export class RolesService {

  constructor(
    private readonly prisma: PrismaClient
  ) {}

  public async list() : Promise<Role[]> {
    return this.prisma.role.findMany();
  }

  public async create(body: any) {
    try {
      return this.prisma.role.create({
        data: {
          name: body.name
        }
      })
    } catch (error) {
      throw new Error(`Error create role: ${error.message}`);
    }
  }

  public async bulkCreate(body) {
    const roles = body.roles
    try {
      return this.prisma.role.createMany({
        data: roles
      })
    } catch (error) {
      throw new Error(`Error bulk create role: ${error.message}`);
    }
  }

  public async show(id: number) {
    return this.prisma.role.findUnique({
      where: {
        id: Number(id)
      }
    });
  }

  public async update(id: number, body: any) {
    try {
      return this.prisma.role.update({
        where: {
          id: Number(id)
        },
        data: {
          name: body.name
        }
      })
    } catch (error) {
      throw new Error(`Error bulk create role: ${error.message}`);
    }
  }

  public async delete(id: number) {
    return this.prisma.role.delete({
      where: {
        id: Number(id)
      }
    })
  }

  public async roleWithPermissions() {
    return this.prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    })
  }

}
