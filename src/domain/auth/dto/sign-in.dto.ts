import { Length } from 'class-validator';

export class SignInDTO {
  @Length(5, 16)
  username: string;

  @Length(8, 16)
  password: string;
}
