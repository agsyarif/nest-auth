import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PermissionsService {
  constructor(
    private readonly prisma: PrismaClient
  ) {}

  public async list() {
    return this.prisma.permission.findMany()
  }

  public async create(body: any) {
    try {
      return this.prisma.permission.create({
        data: {
          name: body.name
        }
      })
    } catch (error) {
      throw new Error(`Error create permission: ${error.message}`);
    }
  }

  public async bulkCreate(body) {
    const permissions = body.permissions
    try {
      return this.prisma.permission.createMany({
        data: permissions
      })
    } catch (error) {
      throw new Error(`Error bulk create role: ${error.message}`);
    }
  }

  public async show(id: number) {
    return this.prisma.permission.findUnique({
      where: {
        id: Number(id)
      }
    });
  }

  public async update(id: number, body: any) {
    try {
      return this.prisma.permission.update({
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
    return this.prisma.permission.delete({
      where: {
        id: Number(id)
      }
    })
  }

}
