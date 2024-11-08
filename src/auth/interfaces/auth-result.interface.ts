import { IUser } from "../../user/interfaces/user.interface";

export interface IAuthResult {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}