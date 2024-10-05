import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {

  constructor(
    private readonly uploadService: UploadService
  ) {}

  @Post('/uploadImage')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: Math.pow(1024, 2) * 1 }, // batasi ukuran file
  }))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadFile(file);
  }

}
