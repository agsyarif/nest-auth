import { IUser } from "../user/interfaces/user.interface";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// digunakan untuk menambahkan key user pada request key global. agar user bisa di akses tanpa perlu deklarasikan @Requesr() terlebih dahulu