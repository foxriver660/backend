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
import { ActorService } from './actor.service';
import { ActorDto } from './dto/actor.dto';

@Controller('actor')
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(HttpStatus.OK)
  @Auth()
  async createGenre() {
    return this.actorService.create();
  }

  @Get('/by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.actorService.bySlug(slug);
  }

  @Get()
  async getAll(@Query('searchParam') searchParam?: string) {
    return this.actorService.getAll(searchParam);
  }
  @Get(':id')
  @Auth('admin')
  async getActor(@Param('id', IdValidationPipe) _id: string) {
    return this.actorService.byId(_id);
  }
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Auth('admin')
  async deleteActor(@Param('id', IdValidationPipe) _id: string) {
    return this.actorService.delete(_id);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Auth('admin')
  async updateActor(
    @Param('id', IdValidationPipe) _id: string,
    @Body() dto: ActorDto
  ) {
    return this.actorService.update(_id, dto);
  }
}
