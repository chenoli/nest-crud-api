import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { PrismaService } from '@database/prisma.service';

import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
  ],
  providers: [AuthService, PrismaService, UsersService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
