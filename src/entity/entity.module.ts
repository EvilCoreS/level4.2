import { Module } from '@nestjs/common';
import { PeopleModule } from './people/people.module';
import { ImagesService } from '../images/images.service';

@Module({
  imports: [PeopleModule]
})
export class EntityModule {}
