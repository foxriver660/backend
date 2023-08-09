import { Module } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { RatingModel } from './rating.model';
import { MovieModule } from 'src/movie/movie.module';

@Module({
  exports: [RatingService],
  controllers: [RatingController],
  providers: [RatingService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: RatingModel,
        schemaOptions: { collection: 'rating' },
      },
    ]),
    MovieModule,
  ],
})
export class RatingModule {}
