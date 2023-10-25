import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { Public } from '@src/utils/metadata';

import { AuthService } from './auth.service';

import { SignUpDTO } from './dto/sign-up.dto';
import { SignInDTO } from './dto/sign-in.dto';

import { UserResponse } from '../users/types/user.response';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/sign-in')
  async login(@Body() request: SignInDTO): Promise<UserResponse> {
    return this.authService.signIn({ ...request });
  }

  @Public()
  @Post('/sign-up')
  @HttpCode(200)
  async register(@Body() request: SignUpDTO): Promise<UserResponse> {
    return this.authService.signUp(request);
  }
}
