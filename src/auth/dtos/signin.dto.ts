import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { NAME_REGEX, PASSWORD_REGEX } from '../../common/consts/regex.const';

export abstract class SignInDto {
  @IsString()
  @IsEmail()
  @Length(5, 255)
  public email!: string;

  @IsString()
  @Length(8, 35)
  @Matches(PASSWORD_REGEX, {
    message:
      'Password requires a lowercase letter, an uppercase letter, and a number or symbol',
  })
  public password!: string;
}