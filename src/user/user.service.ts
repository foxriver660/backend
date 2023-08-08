import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { genSalt, hash } from 'bcryptjs';
import { InjectModel } from 'nestjs-typegoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel } from './user.model';
import { Types } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>
  ) {}

  async byId(_id: string) {
    const user = await this.UserModel.findById(_id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(_id: string, dto: UpdateUserDto) {
    const user = await this.byId(_id);
    const isSameUser = await this.UserModel.findOne({ email: dto.email });
    if (isSameUser && String(_id) !== String(isSameUser._id))
      throw new NotFoundException('Email already in use');

    if (dto.password) {
      const salt = await genSalt(10);
      user.password = await hash(dto.password, salt);
    }
    user.email = dto.email;
    if (dto.isAdmin || dto.isAdmin === false) {
      user.isAdmin = dto.isAdmin;
    }
    await user.save();
    return;
  }

  async getCount() {
    return this.UserModel.find().count().exec();
  }

  async getAll(searchParam?: string) {
    let options = {};
    if (searchParam) {
      options = {
        $or: [
          {
            email: new RegExp(searchParam, 'i'),
          },
        ],
      };
    }
    return this.UserModel.find(options)
      .select('-password -updatedAt -__v')
      .sort({
        createdAt: 'desc',
      })
      .exec();
  }

  async delete(id: string) {
    const doc = await this.UserModel.findByIdAndDelete(id).exec();
    if (!doc) {
      throw new NotFoundException('User not found');
    }
    return doc;
  }
  async toggleFavoriteMovies(movieId: Types.ObjectId, user: UserModel) {
    const { _id, favorites } = user;
    await this.UserModel.findByIdAndUpdate(_id, {
      favorites: favorites.includes(movieId)
        ? favorites.filter((id) => id.toString() !== movieId.toString())
        : [...favorites, movieId],
    });
  }
  async getFavoriteMovies(_id: Types.ObjectId) {
    return this.UserModel.findById(_id, 'favorites')
      .populate({ path: 'favorites', populate: { path: 'genres' } })
      .exec()
      .then((data) => data.favorites);
  }
}
