import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { MovieModel } from './movie.model';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Types } from 'mongoose';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>
  ) {}
  async byId(_id: string) {
    const doc = await this.MovieModel.findById(_id);
    if (!doc) throw new NotFoundException('Movie not found');
    return doc;
  }
  async bySlug(slug: string) {
    const doc = await this.MovieModel.findOne({ slug })
      .populate('actors genres')
      .exec();
    if (!doc) {
      throw new NotFoundException('Movie not found');
    }
    return doc;
  }
  async byActor(actorId: Types.ObjectId) {
    const doc = await this.MovieModel.find({ actors: actorId }).exec();
    if (!doc) {
      throw new NotFoundException('Movies not found');
    }
    return doc;
  }
  async byGenres(genreIds: Types.ObjectId[]) {
    const doc = await this.MovieModel.find({
      genres: { $in: genreIds },
    }).exec();
    if (!doc) {
      throw new NotFoundException('Movies not found');
    }
    return doc;
  }
  async updateCountOpened(slug: string) {
    const doc = await this.MovieModel.findOneAndUpdate(
      { slug },
      {
        $inc: { countOpened: 1 },
      }
    ).exec();
    if (!doc) {
      throw new NotFoundException('Movie not found');
    }
    return doc;
  }
  async update(_id: string, dto: CreateMovieDto) {
    const doc = await this.MovieModel.findByIdAndUpdate(_id, dto, {
      new: true,
    }).exec();
    if (!doc) {
      throw new NotFoundException('Movie not found');
    }
    return doc;
  }

  async create() {
    const defaultValue: CreateMovieDto = {
      bigPoster: '',
      actors: [],
      genres: [],
      description: '',
      poster: '',
      title: '',
      videoUrl: '',
      slug: '',
    };
    const doc = await this.MovieModel.create(defaultValue);
    return doc._id;
  }

  async getAll(searchParam?: string) {
    let options = {};
    if (searchParam) {
      options = {
        $or: [
          {
            title: new RegExp(searchParam, 'i'),
          },
        ],
      };
    }
    return this.MovieModel.find(options)
      .select(' -updatedAt -__v')
      .sort({
        createdAt: 'desc',
      })
      .populate('actors genres')
      .exec();
  }

  async delete(id: string) {
    const doc = await this.MovieModel.findByIdAndDelete(id).exec();
    if (!doc) {
      throw new NotFoundException('Movie not found');
    }
    return doc;
  }
  async getMostPopular() {
    return await this.MovieModel.find({ countOpened: { $gt: 0 } })
      .sort({ countOpened: -1 })
      .populate('genres')
      .exec();
  }
}
