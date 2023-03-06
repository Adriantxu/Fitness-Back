import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserService } from './user.service';
import { Utils } from 'src/utils/middlewareHelper';

@Controller('users')
export class UserController {
  constructor(private userService: UserService, private utils: Utils) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMyself(@Req() req: Request) {
    const user = this.utils.extractUserJwtMiddleware(req);
    const userId = user ? parseInt(user['sub'] as string) : null;

    return await this.userService.getUserById(userId);
  }
}
