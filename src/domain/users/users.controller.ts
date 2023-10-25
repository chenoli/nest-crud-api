import { FileInterceptor } from '@nestjs/platform-express';

import {
  Body,
  Controller,
  FileTypeValidator,
  HttpCode,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  Patch,
  Param,
  ParseFilePipe,
  UploadedFile,
  UseInterceptors,
  Delete,
} from '@nestjs/common';

import { UsersService } from './users.service';

import { User } from './models/users.model';

import { ChangeUsernameDTO } from './dto/change-username.dto';
import { ChangePasswordDTO } from './dto/change-password.dto';

import { STRINGS } from '@constants/strings.constants';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('/change-username/:id')
  async changeUsername(
    @Param('id') id: string,
    @Body() request: ChangeUsernameDTO,
  ): Promise<User> {
    return this.usersService.changeUsername(id, request.username);
  }

  @Patch('/change-password/:id')
  async changePassword(
    @Param('id') id: string,
    @Body() request: ChangePasswordDTO,
  ): Promise<User> {
    if (request.password !== request.confirm_password) {
      throw new HttpException(
        STRINGS.errors.requests.PASSWORDS_DO_NOT_MATCH,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.usersService.changePassword(id, request.password);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Patch('/change-picture/:id/:resource')
  async changeBanner(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 3000000 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
    @Param('id') id: string,
    @Param('resource') resource: string,
  ): Promise<User> {
    switch (resource) {
      case 'profile':
        return this.usersService.changeProfilePicture(id, file.filename);
      case 'banner':
        return this.usersService.changeProfileBanner(id, file.filename);
      default:
        throw new HttpException(
          STRINGS.errors.requests.UNKNOWN_RESOURCE,
          HttpStatus.BAD_REQUEST,
        );
    }
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string) {
    await this.usersService.deleteUser(id);
    return STRINGS.response.DELETED;
  }
}
