import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { Types } from 'mongoose';
import { CreateMovieDto } from './dto/create-movie.dto';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(HttpStatus.OK)
  @Auth()
  async createMovie() {
    return this.movieService.create();
  }

  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.movieService.bySlug(slug);
  }

  @Get('by-actor/:actorId')
  async getByActorId(@Param('actorId') actorId: Types.ObjectId) {
    return this.movieService.byActor(actorId);
  }

  @UsePipes(new ValidationPipe())
  @Post('by-genres')
  async getByGenres(@Body('genresIds') genresIds: Types.ObjectId[]) {
    return this.movieService.byGenres(genresIds);
  }
  @Get()
  async getAll(@Query('searchParam') searchParam?: string) {
    return this.movieService.getAll(searchParam);
  }
  @Get('most-popular')
  async getMostPopular() {
    return this.movieService.getMostPopular();
  }

  @Put('/update-count-opened')
  @HttpCode(HttpStatus.OK)
  async updateCountOpened(@Body('slug') slug: string) {
    return this.movieService.updateCountOpened(slug);
  }

  @Get(':id')
  @Auth('admin')
  async getMovie(@Param('id', IdValidationPipe) _id: string) {
    return this.movieService.byId(_id);
  }
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Auth('admin')
  async deleteMovie(@Param('id', IdValidationPipe) _id: string) {
    return this.movieService.delete(_id);
  }
  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Auth('admin')
  async updateGenre(
    @Param('id', IdValidationPipe) _id: string,
    @Body() dto: CreateMovieDto
  ) {
    return this.movieService.update(_id, dto);
  }
}
