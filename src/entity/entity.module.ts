import { Module } from '@nestjs/common';
import { PeopleModule } from './people/people.module';
import { ImagesService } from '../images/images.service';
import { PlanetModule } from './planet/planet.module';
import { FilmsModule } from './films/films.module';

@Module({
  imports: [PeopleModule, PlanetModule, FilmsModule]
})
export class EntityModule {}
