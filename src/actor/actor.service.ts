import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { ActorModel } from './actor.model';
import { ActorDto } from './dto/actor.dto';

@Injectable()
export class ActorService {
  constructor(
    @InjectModel(ActorModel) private readonly ActorModel: ModelType<ActorModel>
  ) {}
  async byId(_id: string) {
    const actor = await this.ActorModel.findById(_id);
    if (!actor) throw new NotFoundException('Actor not found');
    return actor;
  }
  async bySlug(slug: string) {
    const doc = await this.ActorModel.findOne({ slug }).exec();
    if (!doc) {
      throw new NotFoundException('Actor not found');
    }
    return doc;
  }

  async update(_id: string, dto: ActorDto) {
    const doc = await this.ActorModel.findByIdAndUpdate(_id, dto, {
      new: true,
    }).exec();
    if (!doc) {
      throw new NotFoundException('Actor not found');
    }
    return doc;
  }

  async create() {
    const defaultValue: ActorDto = {
      name: '',
      slug: '',
      photo: '',
    };
    const actor = await this.ActorModel.create(defaultValue);
    return actor._id;
  }

  async getAll(searchParam?: string) {
    let options = {};
    if (searchParam) {
      options = {
        $or: [
          {
            name: new RegExp(searchParam, 'i'),
          },
          {
            slug: new RegExp(searchParam, 'i'),
          },
        ],
      };
    }
    return this.ActorModel.aggregate()
      .match(options)
      .lookup({
        from: 'movies',
        localField: '_id',
        foreignField: 'actors',
        as: 'moviesCompanied',
      })
      .addFields({ countMovies: { $size: '$moviesCompanied' } })
      .project({ __v: 0, updatedAt: 0, moviesCompanied: 0 })
      .sort({
        createdAt: -1,
      })
      .exec();
  }

  async delete(id: string) {
    const doc = await this.ActorModel.findByIdAndDelete(id).exec();
    if (!doc) {
      throw new NotFoundException('actor not found');
    }
    return doc;
  }
}
