import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from 'src/user/user.model';
import { AuthDto } from './dto/auth.dto';
import { hash, genSalt, compare } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel) private UserModel: ModelType<UserModel>
  ) {}

  async login(dto: AuthDto) {
    return this.validateUser(dto);
  }

  async register(dto: AuthDto) {
    const oldUser = await this.UserModel.findOne({ email: dto.email });
    if (oldUser) {
      throw new BadRequestException('User already exists');
    }
    const salt = await genSalt(10);
    const newUser = new this.UserModel({
      email: dto.email,
      password: await hash(dto.password, salt),
    });
    return newUser.save();
  }

  // !ВАЛИДАЦИЯ
  async validateUser(dto: AuthDto) {
    // ИЩЕМ ЮЗЕРА
    const user = await this.UserModel.findOne({ email: dto.email });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // CРАВНИВАЕМ ПОЛУЧЕННЫЙ ПАСС С ПАССОМ В БД
    const isValidPassword = await compare(dto.password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Password is invalid');
    }
  }
}
