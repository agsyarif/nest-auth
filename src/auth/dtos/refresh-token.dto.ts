import { IsJWT, IsString } from 'class-validator';

export abstract class RefreshTokenDto {
  @IsString()
  public refreshToken!: string;
}