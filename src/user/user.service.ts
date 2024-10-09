import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { hash } from 'bcrypt';
import { CommonService } from '../common/common.service';
import { isNull, isUndefined } from '../common/utils/validation.util';
import { createPaginator } from 'prisma-pagination';
import { IUser } from './interfaces/user.interface';
import dayjs from 'dayjs';
import { UpdateUserDto } from './dtos/update.dto';
import { UploadService } from '../upload/upload.service';
import { AccessControlService } from '../access-control/access-control.service';
import { RoleId } from '../common/enums/roles.enum';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly commonService: CommonService,
    private readonly uploadService: UploadService,
    private readonly accessControlService: AccessControlService
  ) {}

  public async create(
    email: string,
    name: string,
    password?: string,
  ): Promise<User> {
    const formattedEmail = email.toLowerCase();
    await this.checkEmailUniqueness(formattedEmail)
    const formattedName = this.commonService.formatName(name);

    const passwordHashed = password ? await hash(password, 10) : '';
    const confirmed = !password;
    
    const newUser = {
      name: formattedName,
      email: formattedEmail,
      password: passwordHashed,
      lastPassword: passwordHashed,
      passwordUpdatedAt: dayjs().unix(),
      confirmed,
      emailVerifiedAt: null,
      phone: '',
      userAvatarImage: '',
      version: 0,
    };

    const createdUser = await this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({ data: newUser });
      return user;
    });

    await this.accessControlService.assignRoleToUser(createdUser.id, RoleId.Member)

    return createdUser;

  }

  public async all(query: any) {
    
    let filter: any = {};
    let filterOr: any = [];

    if (query.q) {
      filterOr = { OR: [{
          name: {
            contains: query.q,
            mode: 'insensitive',
          },
          email: {
            contains: query.q,
            mode: 'insensitive',
          },
        }]
      }

    }

    if (query.countryCode) {
      filter = { ...filter, countryId: Number(query.countryCode) }
    }

    const pageNumber = query.page ? Number(query.page) : null;
    const limitNumber = query.limit ? Number(query.limit) : 10;

    let sortField = query.sortField ?? 'updatedAt'
    let sortDir = query.sortDir ?? 'desc'

    let paginate = createPaginator({perPage: limitNumber})
    let result =  await paginate(this.prisma.user, {
      where: {
        ...filter,
        ...filterOr,
      },
      orderBy: {[sortField]: sortDir },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      },
    },
    {
      page: pageNumber
    })

    const data = result.data.map(user => user);
    return [data, result.meta]
  }

  public async findOneById(id: number): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      include: { 
        roles: {
          include: {
            role: true
          }
        }
      },
    });
    
    console.log(user);
    
    this.commonService.checkEntityExistence(user, 'User');
    return user;
  }

  public async findOneByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        roles: {
          include: {
            role: true
          }
        } 
      },
    });

    this.throwUnauthorizedException(user);
    return user;
  }

  public async findOneByWithRoles(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      include: { 
        roles: {
          include: {
            role: true
          }
        }
      },
    });
    this.commonService.checkEntityExistence(user, 'User');
    return user;
  }

  public async findOneByCredentials(
    id: number,
    version: number,
  ): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { 
        roles: {
          include: {
            role: true
          }
        }
      },
    });
    this.throwUnauthorizedException(user);

    if (user.version !== version) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  public async update(user: User, dto: UpdateUserDto): Promise<User> {
    const { name, phone } = dto;
    
    try {
      return await this.prisma.user.update({
        where: { id: user.id },
        data: {
          name,
          phone
        },
      });
    } catch (error) {
      throw new Error(`Error update user: ${error.message}`);
    }

  }

  public async updateAvatar(user: IUser, file: Express.Multer.File) {
    try {
      const oldAvatarImage = (await this.findOneById(user.id)).userAvatarImage;
      if(oldAvatarImage) {
        const filePath = oldAvatarImage;
        await this.uploadService.removeFile(filePath);
      }

      const avatar = await this.uploadService.uploadFile(file);
      const update = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          userAvatarImage: avatar,
        }
      })

      return update
    } catch (error) {
      throw new Error(`Error update avatar: ${error.message}`);
    }
    
  }


  public async resetPassword(
    userId: number,
    version: number,
    password: string,
  ): Promise<User> {
    const user = await this.findOneByCredentials(userId, version);

    return await this.prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        lastPassword: user.password,
        password: await hash(password, 10),
        version: user.version + 1,
        passwordUpdatedAt: dayjs().unix()
      }
    })
  }
  
  // private function
  private async checkEmailUniqueness(email: string): Promise<void> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }
  }

  private async assignRoleToUser(userId: number, roleName: string, prisma) {
    const role = await prisma.role.findFirst({
      where: { name: roleName },
      select: { id: true },
    });
  
    if (!role) {
      throw new NotFoundException(`Role with name ${roleName} not found`);
    }

    const existingRole = await prisma.modelHasRole.findFirst({
      where: {
        modelId: userId,
        roleId: role.id,
      },
    });
  
    if (existingRole) {
      return `User already has role ${roleName}`;
    }  

    // Assign role to user
    return prisma.modelHasRole.create({
      data: {
        modelId: userId,
        roleId: role.id,
      },
    });
  }

  private throwUnauthorizedException(
    user: undefined | null | User,
  ): void {
    if (isUndefined(user) || isNull(user)) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  // mapping data
  public toUserDto(user: User): any {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      userAvatarImage: user.userAvatarImage,
      version: user.version,
      confirmed: user.confirmed,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  public toUserWithRoles(payload: any) {    
    const user = payload.user;
    const userDto = this.toUserDto(user)
    userDto['roles'] = user.modelHasRoles
    
    return userDto
  }

  public checkRoles(payload, role) : boolean {
    const user = payload.user;
    console.log(user.roles.role);
    console.log(role);
    
    return payload.user.modelHasRoles[0].role.name?.includes(role);
  }
  
}
