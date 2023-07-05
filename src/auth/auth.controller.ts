import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Post('/login')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthDto) {
    return this.AuthService.login(dto);
  }
  @Post('/login/access-token')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async getNewTokens(@Body() dto: RefreshTokenDto) {
    return this.AuthService.getNewTokens(dto);
  }
  @Post('/register')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async register(@Body() dto: AuthDto) {
    return this.AuthService.register(dto);
  }
}
