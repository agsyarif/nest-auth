import { Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Permissions } from '../common/decorators/permissions.decorator';

@Controller('article')
export class ArticleController {

  @Get('/')
  @UseGuards(AuthGuard)
  @Permissions('index article')
  async articles(@Request() req: any) {
    return 'index';
  }

  @Post('/')
  @UseGuards(AuthGuard)
  @Permissions('create article')
  async create(@Request() req: any) {
    return 'create';
  }

  @Get('/:id')
  async show(@Request() req: any, @Param() id: number) {
    return 'show';
  }

  @Put('/:id')
  async update(@Request() req: any, @Param() id: number) {
    return 'update';
  }

  @Delete('/:id')
  async destroy(@Request() req: any, @Param() id: number) {
    return 'destroy';
  }

}
