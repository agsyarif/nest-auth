import { IUser } from '../../user/interfaces/user.interface';
import { ITokenBase } from './token-base.interface';

export interface IUserAccessPayload {
  user: IUser;
  id: number;
}

export interface IUserAccessToken extends IUserAccessPayload, ITokenBase {}
