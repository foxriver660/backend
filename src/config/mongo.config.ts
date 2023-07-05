import { ConfigService } from '@nestjs/config';
import { TypegooseModuleOptions } from 'nestjs-typegoose';

export const getMongoDbConfig = async (
  configService: ConfigService
): Promise<TypegooseModuleOptions> => {
  console.log(configService.get('MONGO_URI'));
  return {
    uri: configService.get('MONGO_URI'),
  };
};
