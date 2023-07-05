import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserModel } from 'src/user/user.model';

export class onlyAdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{ user: UserModel }>();
    const user = request.user;
    if (!user.isAdmin) throw new ForbiddenException('Only admin route');
    return user.isAdmin;
  }
}
