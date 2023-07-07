import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { User } from './decorators/users.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Auth('admin')
  async getUsers(@Query('searchParam') searchParam?: string) {
    return this.userService.getAll(searchParam);
  }

  @Get('profile')
  @Auth()
  async getProfile(@User('_id') _id: string) {
    return this.userService.byId(_id);
  }

  @UsePipes(new ValidationPipe())
  @Put('profile')
  @HttpCode(HttpStatus.OK)
  @Auth()
  async updateProfile(
    @User('_id') _id: string,
    @Body() profile: UpdateUserDto
  ) {
    return this.userService.updateProfile(_id, profile);
  }

  @Get('count')
  @Auth('admin')
  async getCountUsers() {
    return this.userService.getCount();
  }

  @Get(':id')
  @Auth('admin')
  async getUser(@Param('id', IdValidationPipe) _id: string) {
    return this.userService.byId(_id);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Auth('admin')
  async updateUser(
    @Param('id', IdValidationPipe) _id: string,
    @Body() profile: UpdateUserDto
  ) {
    return this.userService.updateProfile(_id, profile);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Auth('admin')
  async deleteUser(@Param('id', IdValidationPipe) _id: string) {
    return this.userService.delete(_id);
  }
}
