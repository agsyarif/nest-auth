import { Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { __ } from '../common/enums/permissions.enum';

@Controller('article')
@UseGuards(AuthGuard)
@Permissions(__.M_ARTICLES)
export class ArticleController {

  @Get('/')
  @Permissions(__.V_ARTICLES)
  async articles(@Request() req: any) {
    return 'index';
  }

  @Post('/')
  @Permissions(__.C_ARTICLES)
  async create(@Request() req: any) {
    return 'create';
  }

  @Get('/:id')
  @Permissions(__.V_ARTICLE)
  async show(@Request() req: any, @Param() id: number) {
    return 'show';
  }

  @Put('/:id')
  @Permissions(__.U_ARTICLES)
  async update(@Request() req: any, @Param() id: number) {
    return 'update';
  }

  @Delete('/:id')
  @Permissions(__.D_ARTICLES)
  async destroy(@Request() req: any, @Param() id: number) {
    return 'destroy';
  }

}
