import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '../jwt/jwt.service';
import { TokenTypeEnum } from '../jwt/enums/token-type.enum';
import { Reflector } from '@nestjs/core';
import { UserService } from '../user/user.service';
import { PERMISSION_KEY } from '../common/decorators/permissions.decorator';
import { AccessControlService } from '../access-control/access-control.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private reflector: Reflector,
    private accessControlService: AccessControlService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    
    let payload;
    try {
      payload = await this.jwtService.verifyToken(token, TokenTypeEnum.ACCESS);
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }

    request['user'] = this.userService.toUserWithRoles(payload);

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions) {
      return true;
    }

    const hasPermission = await this.checkPermissions(payload.id, requiredPermissions);
    return hasPermission;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async checkPermissions(userId: string, permissions: string[]): Promise<boolean> {
    const permissionChecks = permissions.map(permission =>
      this.accessControlService.userHasPermission(Number(userId), permission)
    );

    const results = await Promise.all(permissionChecks);
    return results.some(result => result);
  }
}