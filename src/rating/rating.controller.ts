import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/user/decorators/users.decorator';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { Types } from 'mongoose';
import { SetRatingDto } from './dto/set-rating.dto';

@Controller('ratings')
export class RatingController {
  constructor(private ratingService: RatingService) {}
  @Get(':movieId')
  @Auth()
  async getMovieValueByUser(
    @Param('movieId', IdValidationPipe) movieId: Types.ObjectId,
    @User('_id') _id: Types.ObjectId
  ) {
    return this.ratingService.getMovieValueByUser(movieId, _id);
  }

  @UsePipes(new ValidationPipe())
  @Post('set-rating')
  @HttpCode(HttpStatus.OK)
  @Auth()
  async setRatingByUser(
    @User('_id') _id: Types.ObjectId,
    @Body() dto: SetRatingDto
  ) {
    return this.ratingService.setRatingByUser(_id, dto);
  }
}
