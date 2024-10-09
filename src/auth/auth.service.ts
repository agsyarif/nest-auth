import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { SignUpDto } from './dtos/signup.dto';
import { IAuthResult } from './interfaces/auth-result.interface';
import { UserService } from '../user/user.service';
import { JwtService } from '../jwt/jwt.service';
import { TokenTypeEnum } from '../jwt/enums/token-type.enum';
import { SignInDto } from './dtos/signin.dto';
import { compare } from 'bcrypt';
import { IUser } from '../user/interfaces/user.interface';
import dayjs from 'dayjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { IRefreshToken } from '../jwt/interfaces/refresh-token.interface';
import { isNull, isUndefined } from '../common/utils/validation.util';
import { IMessage } from '../common/interfaces/message.interface';
import { CommonService } from '../common/common.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly commonService: CommonService
  ) {}

  public async signUp(dto: SignUpDto, domain?: string): Promise<IAuthResult> {
    const { name, email, password1, password2 } = dto;
    this.comparePasswords(password1, password2);
    const newUser = await this.userService.create(email, name, password1);

    // const confirmationToken = await this.jwtService.generateToken(
    //   user,
    //   TokenTypeEnum.CONFIRMATION,
    //   domain,
    // );
    // this.mailerService.sendConfirmationEmail(user, confirmationToken);
    console.log(newUser);
    
    const user = await this.userService.findOneById(newUser.id);
    const [accessToken, refreshToken] = await this.generateAuthTokens(
      user,
      domain,
    );

    const resUser = this.userService.toUserDto(user)
    return { user: resUser, accessToken, refreshToken };
  }

  public async singIn(dto: SignInDto, domain?: string): Promise<IAuthResult> {
    const { email, password } = dto;
    const user = await this.userService.findOneByEmail(email);

    if (!(await compare(password, user.password))) {
      await this.checkLastPassword(user, password);
    }

    // // VALIDASI CONFIRM EMAIL
    // if (!user.confirmed) {
    //   const confirmationToken = await this.jwtService.generateToken(
    //     user,
    //     TokenTypeEnum.CONFIRMATION,
    //     domain,
    //   );
    //   this.mailerService.sendConfirmationEmail(user, confirmationToken);
    //   throw new UnauthorizedException(
    //     'Please confirm your email, a new email has been sent',
    //   );
    // }
    
    const [accessToken, refreshToken] = await this.generateAuthTokens(
      user,
      domain,
    );
    
    const resUser = this.userService.toUserDto(user)
    return { user: resUser, accessToken, refreshToken };
  }

  private async checkLastPassword(
    user: IUser,
    password: string,
  ): Promise<void> {
    const { lastPassword, passwordUpdatedAt } = user;

    if (lastPassword.length === 0 || !(await compare(password, lastPassword))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const now = dayjs();
    const time = dayjs(passwordUpdatedAt);
    const months = now.diff(time, 'month');
    const message = 'You changed your password ';

    if (months > 0) {
      throw new UnauthorizedException(
        message + months + (months > 1 ? ' months ago' : ' month ago'),
      );
    }

    const days = now.diff(time, 'day');

    if (days > 0) {
      throw new UnauthorizedException(
        message + days + (days > 1 ? ' days ago' : ' day ago'),
      );
    }

    const hours = now.diff(time, 'hour');

    if (hours > 0) {
      throw new UnauthorizedException(
        message + hours + (hours > 1 ? ' hours ago' : ' hour ago'),
      );
    }

    throw new UnauthorizedException(message + 'recently');
  }

  public async refreshTokenAccess(
    refreshToken: string,
    domain?: string,
  ): Promise<IAuthResult> {
    const { id, version, tokenId } =
      await this.jwtService.verifyToken<IRefreshToken>(
        refreshToken,
        TokenTypeEnum.REFRESH,
      );
    await this.checkIfTokenIsBlacklisted(id, tokenId);
    const user = await this.userService.findOneByCredentials(id, version);
    const [accessToken, newRefreshToken] = await this.generateAuthTokens(
      user,
      domain,
      tokenId,
    );
    const rUser = this.userService.toUserDto(user);
    return { user: rUser, accessToken, refreshToken: newRefreshToken };
  }

  public async setPassword(user: User, password: string) : Promise<IMessage> {
    await this.userService.resetPassword(user.id, user.version, password);
    return this.commonService.generateMessage('Password set successful');
  }

  public async logout(refreshToken: string): Promise<IMessage> {
    
    const { id, tokenId, exp } = await this.jwtService.verifyToken<IRefreshToken>(
      refreshToken,
      TokenTypeEnum.REFRESH,
    );

    await this.checkIfTokenIsBlacklisted(id, tokenId);
    
    await this.blacklistToken(id, tokenId, exp);
    return this.commonService.generateMessage('Logout successful');
  }

  // private function
  private comparePasswords(password1: string, password2: string): void {
    if (password1 !== password2) {
      throw new BadRequestException('Passwords do not match');
    }
  }

  private async generateAuthTokens(
    user: User,
    domain?: string,
    tokenId?: string,
  ): Promise<[string, string]> {
    return Promise.all([
      this.jwtService.generateToken(
        user,
        TokenTypeEnum.ACCESS,
        domain,
        tokenId,
      ),
      this.jwtService.generateToken(
        user,
        TokenTypeEnum.REFRESH,
        domain,
        tokenId,
      ),
    ]);
  }

  private async checkIfTokenIsBlacklisted(
    userId: number,
    tokenId: string,
  ): Promise<void> {
    const time = await this.cacheManager.get<number>(
      `blacklist:${userId}:${tokenId}`,
    );

    if (!isUndefined(time) && !isNull(time)) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async blacklistToken(
    userId: number,
    tokenId: string,
    exp: number,
  ): Promise<void> {
    const now = dayjs().unix();
    const ttl = (exp - now) * 1000;

    if (ttl > 0) {
      await this.commonService.throwInternalError(
        this.cacheManager.set(`blacklist:${userId}:${tokenId}`, now, ttl),
      );
    }
  }
}
