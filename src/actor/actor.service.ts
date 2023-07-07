import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { ActorModel } from './actor.model';

@Injectable()
export class ActorService {
  constructor(
    @InjectModel(ActorModel) private readonly GenreModel: ModelType<ActorModel>
  ) {}
}
