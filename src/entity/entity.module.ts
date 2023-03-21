import { Module } from '@nestjs/common';
import { PeopleModule } from './people/people.module';
import { ImagesService } from '../images/images.service';
import { PlanetModule } from './planet/planet.module';
import { FilmsModule } from './films/films.module';
import { SpeciesModule } from './species/species.module';

@Module({
  imports: [PeopleModule, PlanetModule, FilmsModule, SpeciesModule]
})
export class EntityModule {}
