import { IsEmail, Length } from 'class-validator';

export class SignUpDTO {
  @IsEmail()
  email: string;

  @Length(5, 16)
  username: string;

  @Length(8, 16)
  password: string;

  profile_picture?: string;
}
