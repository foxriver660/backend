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
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { CreateGenreDto } from './dto/create-genre.dto';
import { GenreService } from './genre.service';

@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(HttpStatus.OK)
  @Auth()
  async createGenre() {
    return this.genreService.create();
  }

  @Get('/by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.genreService.bySlug(slug);
  }
  @Get('/collections')
  async getCollections() {
    return this.genreService.getCollectionsGenre();
  }
  @Get()
  async getAll(@Query('searchParam') searchParam?: string) {
    return this.genreService.getAll(searchParam);
  }
  @Get(':id')
  @Auth('admin')
  async getGenre(@Param('id', IdValidationPipe) _id: string) {
    return this.genreService.byId(_id);
  }
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Auth('admin')
  async deleteGenre(@Param('id', IdValidationPipe) _id: string) {
    return this.genreService.delete(_id);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Auth('admin')
  async updateGenre(
    @Param('id', IdValidationPipe) _id: string,
    @Body() dto: CreateGenreDto
  ) {
    return this.genreService.update(_id, dto);
  }
}
