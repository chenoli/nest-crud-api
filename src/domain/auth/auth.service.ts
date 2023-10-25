import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { UsersService } from '../users/users.service';

import { SignUpDTO } from './dto/sign-up.dto';
import { SignInDTO } from './dto/sign-in.dto';

import { UserResponse } from '../users/types/user.response';

import { STRINGS } from '@constants/strings.constants';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async signIn(request: SignInDTO): Promise<UserResponse> {
    const user = await this.usersService.getById(
      request.username,
      request.password,
    );

    if (user) {
      const token = this.jwtService.sign(
        { user },
        {
          secret: process.env.JWT_SECRET,
        },
      );
      return {
        user,
        token,
      };
    } else {
      throw new HttpException(
        STRINGS.errors.model.user.USER_NOT_FOUND,
        HttpStatus.GONE,
      );
    }
  }

  async signUp(request: SignUpDTO): Promise<UserResponse> {
    try {
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const password = await bcrypt.hash(request.password, salt);

      const user = await this.usersService.post({
        ...request,
        password,
      });

      return {
        user,
        token: this.jwtService.sign(
          { user },
          { secret: process.env.JWT_SECRET },
        ),
      };
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new HttpException(
          STRINGS.errors.model.user.ALREADY_EXISTS,
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        STRINGS.errors.requests.INTERNAL_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
