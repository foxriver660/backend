import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Expression } from 'mongoose';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { FileService } from './file.service';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @Auth('admin')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() files: Express.Multer.File,
    @Query('folder') folder?: string
  ) {
    return this.fileService.saveFiles([files], folder);
  }
}
