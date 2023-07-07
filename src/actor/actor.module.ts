import { Module } from '@nestjs/common';
import { ActorService } from './actor.service';

@Module({
  providers: [ActorService]
})
export class ActorModule {}
