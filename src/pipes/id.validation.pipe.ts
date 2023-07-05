import { Types } from 'mongoose';
import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class IdValidationPipe implements PipeTransform {
  transform(val: string, meta: ArgumentMetadata) {
    if (meta.type !== 'param') return val;
    if (!Types.ObjectId.isValid(val))
      throw new BadRequestException('Invalid Format id');
    return val;
  }
}
