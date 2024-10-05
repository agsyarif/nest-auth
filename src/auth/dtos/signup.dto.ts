import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { NAME_REGEX } from '../../common/consts/regex.const';
import { PasswordsDto } from './password.dto';

export abstract class SignUpDto extends PasswordsDto {
  @IsString()
  @Length(3, 100, {
    message: 'Name has to be between 3 and 50 characters.',
  })
  @Matches(NAME_REGEX, {
    message: 'Name can only contain letters, dtos, numbers and spaces.',
  })
  public name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Length(5, 255)
  email: string;
}