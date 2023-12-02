import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { GenreController } from './genre.controller';
import { GenreModel } from './genre.model';
import { GenreService } from './genre.service';
import { MovieModule } from 'src/movie/movie.module';

@Module({
  controllers: [GenreController],
  providers: [GenreService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: GenreModel,
        schemaOptions: { collection: 'genres' },
      },
    ]),
    ConfigModule,
    MovieModule,
  ],
})
export class GenreModule {}
