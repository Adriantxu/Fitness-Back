import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Patch,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserService } from './user.service';
import { Utils } from 'src/utils/middlewareHelper';
import { UserUpdateDto } from './dto';
import { validate } from 'class-validator';

@Controller('users')
export class UserController {
  constructor(private userService: UserService, private utils: Utils) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMyself(@Req() req: Request) {
    const user = this.utils.extractUserJwtMiddleware(req);
    const userId = user ? parseInt(user['sub'] as string) : null;

    if (userId == null)
      throw new ForbiddenException(
        'An error happend while retrieving information.',
      );
    return await this.userService.getUserById(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('me')
  @UsePipes(new ValidationPipe())
  async updateProfile(@Req() req: Request, @Body() rawBody: UserUpdateDto) {
    const user = this.utils.extractUserJwtMiddleware(req);
    const userId = user ? parseInt(user['sub'] as string) : null;
    const errors = await validate(rawBody);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    if (userId == null) {
      throw new ForbiddenException(
        'An error happend while retrieving information.',
      );
    }
    return await this.userService.updateProfile(userId, rawBody);
  }
}
