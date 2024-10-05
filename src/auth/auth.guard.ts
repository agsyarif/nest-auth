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
import { Role } from '../common/enums/roles.enum';
import { ROLES_KEY } from '../common/decorators/roles.decorator';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {

      const payload = await this.jwtService.verifyToken(
        token,
        TokenTypeEnum.ACCESS,
      );
      
      if (!payload) {
        throw new UnauthorizedException();
      }

      request['user'] = this.userService.toUserWithRoles(payload);

      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (!requiredRoles) { 
        return true;
      }

      const isTrue = requiredRoles.some(
        (role) => this.userService.checkRoles(payload, role)
      );      
      return isTrue
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}