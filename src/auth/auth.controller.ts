import { Body, Controller, Get, Post, Put, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/signup.dto';
import { AuthGuard } from './auth.guard';
import { SignInDto } from './dtos/signin.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { IMessage } from '../common/interfaces/message.interface';
import { UpdateUserDto } from '../user/dtos/update.dto';
import { UserService } from '../user/user.service';
import { IAuthResult } from './interfaces/auth-result.interface';
import { IUser } from '../user/interfaces/user.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvatarOptions } from '../upload/options/avatar.option';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post('signup')
  async signup(@Body() body: SignUpDto) : Promise<IAuthResult> {
    return this.authService.signUp(body);
  }

  @Post('signin')
  async signin(@Body() body: SignInDto) : Promise<IAuthResult> {
    return this.authService.singIn(body);
  }

  @Get('current')
  @UseGuards(AuthGuard)
  async current(@Request() req: any) {
    return req.user
  }

  @Put('current')
  @UseGuards(AuthGuard)
  async update(@Request() req: any, @Body() body: UpdateUserDto) : Promise<IUser> {
    return this.userService.update(req.user, body)
  }

  @Post('avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', AvatarOptions))
  async avatar(@Request() req: any, @UploadedFile() file: Express.Multer.File) : Promise<IUser> {
    return this.userService.updateAvatar(req.user, file);
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: RefreshTokenDto) : Promise<IAuthResult> {
    return this.authService.refreshTokenAccess(body.refreshToken);
  }

  @Post('logout')
  async logout(@Body() body: RefreshTokenDto) {
    return this.authService.logout(body.refreshToken);
  }

  @Post('set-password')
  @UseGuards(AuthGuard)
  async setPasssword(@Request() req: any, @Body('password') password: string) : Promise<IMessage> {
    return this.authService.setPassword(req.user, password);
  }
}
