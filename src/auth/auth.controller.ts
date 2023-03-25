import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto/auth.register.dto';
import { AuthLoginDto } from './dto/auth.login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // /auth/signup
  @Post('signup')
  @UsePipes(new ValidationPipe())
  signUp(@Body() dto: AuthRegisterDto) {
    // Body.toString();
    return this.authService.signUp(dto);
  }

  // /auth/login
  @Post('login')
  @UsePipes(new ValidationPipe())
  login(@Body() dto: AuthLoginDto) {
    return this.authService.login(dto);
  }
}
