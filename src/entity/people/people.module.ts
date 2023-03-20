import { Module } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleController } from './people.controller';
import { ImagesService } from '../../images/images.service';

@Module({
  controllers: [PeopleController],
  providers: [PeopleService, ImagesService],
})
export class PeopleModule {}
