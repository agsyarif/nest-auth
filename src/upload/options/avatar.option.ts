import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

const uuidWithoutDashes = uuidv4().replace(/-/g, '');

export const AvatarOptions = {
  storage: diskStorage({
    destination: './uploads/avatars',
    filename: (req, file, cb) => {
      const fileExtName = extname(file.originalname);
      const fileName = `${uuidWithoutDashes}${fileExtName}`;
      cb(null, fileName);
    },
  }),
  limits: { fileSize: Math.pow(1024, 2) * 2 }, // Batasan ukuran file (2MB)
};
