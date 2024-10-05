import { IsNumber, IsNumberString, IsString } from 'class-validator';

export abstract class UpdateUserDto {
  @IsString()
  name?: string;

  @IsNumberString()
  phone?: string
}