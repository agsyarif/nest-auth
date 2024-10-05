import { Injectable, UploadedFile, UseInterceptors } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';


@Injectable()
export class UploadService {

  public async uploadFile(file: Express.Multer.File): Promise<string> {
    return file.path;
  }

  public async removeFile(filePath: string) {
    const oldAvatarPath = join(process.cwd(), filePath);
    if (fs.existsSync(oldAvatarPath)) {
      fs.unlinkSync(oldAvatarPath);
    }
  }
}
