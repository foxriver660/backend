import { Ref, prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { MovieModel } from 'src/movie/movie.model';
import { UserModel } from 'src/user/user.model';

// ДЛЯ ПОЛУЧЕНИЯ ID
export interface RatingModel extends Base {}

export class RatingModel extends TimeStamps {
  @prop()
  value: number;

  @prop({ ref: () => UserModel })
  userId: Ref<UserModel>;

  @prop({ ref: () => MovieModel })
  movieId: Ref<MovieModel>;
}
