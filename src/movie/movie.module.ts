import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { MovieModel } from './movie.model';
import { TelegramModule } from 'src/telegram/telegram.module';

@Module({
  exports: [MovieService],
  controllers: [MovieController],
  providers: [MovieService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: MovieModel,
        schemaOptions: { collection: 'movies' },
      },
    ]),
    TelegramModule,
  ],
})
export class MovieModule {}
