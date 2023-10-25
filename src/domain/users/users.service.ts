import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { PrismaService } from '@database/prisma.service';

import { User } from './models/users.model';

import { STRINGS } from '@constants/strings.constants';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getById(username: string, password: string): Promise<User> {
    const user = await this.prisma.users.findFirst({
      where: {
        username,
      },
    });

    if (!user) {
      throw new HttpException(
        STRINGS.errors.model.user.USER_NOT_FOUND,
        HttpStatus.GONE,
      );
    }

    const isPassCorrect = await bcrypt.compare(password, user.password);

    if (!isPassCorrect) {
      throw new HttpException(
        STRINGS.errors.model.user.INCORRECT_USERNAME_PASS,
        HttpStatus.BAD_REQUEST,
      );
    }

    return user;
  }

  async post(user: User): Promise<User> {
    return this.prisma.users.create({
      data: user,
    });
  }

  async changeUsername(id: string, username: string): Promise<User> {
    return this.prisma.users.update({
      where: {
        id,
      },
      data: {
        username,
      },
    });
  }

  async changePassword(id: string, password: string) {
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const encrypted = await bcrypt.hash(password, salt);

    return this.prisma.users.update({
      where: {
        id,
      },
      data: {
        password: encrypted,
      },
    });
  }

  async changeProfilePicture(
    id: string,
    profile_picture: string,
  ): Promise<User> {
    return this.prisma.users.update({
      where: {
        id,
      },
      data: {
        profile_picture,
      },
    });
  }

  async changeProfileBanner(id: string, profile_banner: string): Promise<User> {
    return this.prisma.users.update({
      where: {
        id,
      },
      data: {
        profile_banner,
      },
    });
  }

  async deleteUser(id: string) {
    try {
      await this.prisma.users.delete({
        where: {
          id,
        },
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new HttpException(
          STRINGS.errors.requests.DELETE_NOT_FOUND,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        STRINGS.errors.requests.INTERNAL_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
