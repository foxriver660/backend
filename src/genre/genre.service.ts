import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreateGenreDto } from './dto/create-genre.dto';
import { GenreModel } from './genre.model';

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>
  ) {}

  async byId(_id: string) {
    const genre = await this.GenreModel.findById(_id);
    if (!genre) throw new NotFoundException('Genre not found');
    return genre;
  }
  // АПДЕЙТ ЖАНРА
  async update(_id: string, dto: CreateGenreDto) {
    return this.GenreModel.findByIdAndUpdate(_id, dto, {
      new: true,
    }).exec();
  }
  // КОЛ_ВО ЮЗЕРОВ
  async getCount() {
    return this.UserModel.find().count().exec();
  }
  // ПОЛУЧИТЬ ВСЕ ЮЗЕРОВ
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
  // УДАЛИТЬ ЮЗЕРА
  async delete(id: string) {
    return this.UserModel.findByIdAndDelete(id).exec();
  }
}
