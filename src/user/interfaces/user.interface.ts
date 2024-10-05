export interface IUser {
  id: number;
  name: string;
  email: string;
  confirmed: boolean;
  emailVerifiedAt?: Date;
  phone: string;
  password?: string;
  userAvatarImage: string;
  version: number;
  lastPassword?: string;
  passwordUpdatedAt?: number;
  createdAt: Date;
  updatedAt: Date;
  roles?: any
}