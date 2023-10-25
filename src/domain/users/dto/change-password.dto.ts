import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDTO {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  confirm_password: string;
}
