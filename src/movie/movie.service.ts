import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { MovieModel } from './movie.model';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Types } from 'mongoose';
import { TelegramService } from 'src/telegram/telegram.service';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>,
    private readonly telegramService: TelegramService
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

    if (!doc.length) {
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
  async updateRating(id: Types.ObjectId, newRating: number) {
    return this.MovieModel.findByIdAndUpdate(
      id,
      {
        rating: newRating,
      },
      { new: true }
    ).exec();
  }

  async updateCountOpened(slug: string) {
    const doc = await this.MovieModel.findOneAndUpdate(
      { slug },
      {
        $inc: { countOpened: 1 },
      },
      { new: true }
    ).exec();
    if (!doc) {
      throw new NotFoundException('Movie not found');
    }
    return doc;
  }
  async update(_id: string, dto: CreateMovieDto) {
    if (!dto.isSendTelegram) {
      await this.sendNotification(dto);
      dto.isSendTelegram = 'true';
    }
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
      poster: '',
      title: '',
      videoUrl: '',
      slug: '',
    };
    const doc = await this.MovieModel.create(defaultValue);
    return doc._id;
  }

  async getAll(searchTerm?: string) {
    let options = {};
    if (searchTerm) {
      options = {
        $or: [
          {
            title: new RegExp(searchTerm, 'i'),
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
  async sendNotification(dto: CreateMovieDto) {
    await this.telegramService.sendPhoto(
      'https://w7.pngwing.com/pngs/691/866/png-transparent-computer-icons-button-arrow-successful-text-number-symbol.png'
    );
    const msg = `<b>${dto.title}</b>`;

    await this.telegramService.sendMessage(msg, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              url: `https://www.youtube.com/watch?v=${dto.videoUrl}`,
              text: 'Watch',
            },
          ],
        ],
      },
    });
  }
}
