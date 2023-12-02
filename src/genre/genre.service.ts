import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreateGenreDto } from './dto/create-genre.dto';
import { GenreModel } from './genre.model';
import { MovieService } from 'src/movie/movie.service';

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>,
    private readonly movieService: MovieService
  ) {}

  async byId(_id: string) {
    const doc = await this.GenreModel.findById(_id);
    if (!doc) throw new NotFoundException('Genre not found');
    return doc;
  }
  async bySlug(slug: string) {
    const doc = await this.GenreModel.findOne({ slug }).exec();
    if (!doc) {
      throw new NotFoundException('Actor not found');
    }
    return doc;
  }
  //! UPDATE GENRE
  async update(_id: string, dto: CreateGenreDto) {
    const doc = await this.GenreModel.findByIdAndUpdate(_id, dto, {
      new: true,
    }).exec();
    if (!doc) {
      throw new NotFoundException('Genre not found');
    }
    return doc;
  }
  //! CREATE GENRE
  async create() {
    const defaultValue: CreateGenreDto = {
      name: '',
      slug: '',
      description: '',
      icon: '',
    };
    const genre = await this.GenreModel.create(defaultValue);
    return genre._id;
  }
  // ! GET COLLECTIONS GENRE
  async getCollectionsGenre() {
    const genres = await this.getAll();
    const collection = await Promise.all(
      genres.map(async (genre) => {
        /*   console.log(genre); */
        const moviesByGenre = await this.movieService.byGenres([genre._id]);

        const result = {
          _id: String(genre._id),
          image: moviesByGenre[0] ? moviesByGenre[0].bigPoster : null,
          slug: genre.slug,
          title: genre.name,
        };
        return result;
      })
    );
    return collection;
  }

  // ! GET ALL GENRES
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
          {
            description: new RegExp(searchParam, 'i'),
          },
        ],
      };
    }
    return this.GenreModel.find(options)
      .select(' -updatedAt -__v')
      .sort({
        createdAt: 'desc',
      })
      .exec();
  }

  async delete(id: string) {
    const doc = await this.GenreModel.findByIdAndDelete(id).exec();
    if (!doc) {
      throw new NotFoundException('Genre not found');
    }
    return doc;
  }
}
