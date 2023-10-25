import { extname } from 'path';
import { v4 as uuid } from 'uuid';

import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { MulterModule } from '@nestjs/platform-express';

import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { diskStorage } from 'multer';

import { PrismaService } from '@database/prisma.service';

import { AuthController } from './domain/auth/auth.controller';
import { UsersController } from './domain/users/users.controller';

import { AuthModule } from './domain/auth/auth.module';
import { UsersModule } from './domain/users/users.module';

import { UsersService } from './domain/users/users.service';
import { AuthService } from './domain/auth/auth.service';

import { AuthGuard } from './domain/auth/auth.guard';

import { RemovePasswordMiddleware } from './middlewares/remove-password.middleware';
import { MyThrottlerGuard } from './middlewares/throttler-guard.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule,
    ThrottlerModule.forRoot([
      {
        ttl: 600,
        limit: 3,
      },
    ]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          cb(null, `${uuid()}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [UsersController, AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RemovePasswordMiddleware,
    },
    {
      provide: APP_GUARD,
      useClass: MyThrottlerGuard,
    },
    PrismaService,
    AuthService,
    UsersService,
    JwtService,
  ],
})
export class AppModule {}
