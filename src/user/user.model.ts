import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

// ДЛЯ ПОЛУЧЕНИЯ ID
export interface UserModel extends Base {}

export class UserModel extends TimeStamps {
  static findOne(arg0: { email: string }) {
    throw new Error('Method not implemented.');
  }
  @prop({ unique: true })
  email: string;

  @prop()
  password: string;

  @prop({ default: false })
  isAdmin: boolean;

  @prop({ default: [] })
  favorites?: [];
}
