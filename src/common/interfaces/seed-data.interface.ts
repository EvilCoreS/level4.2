import { DeepPartial } from 'typeorm';
import { Film } from '../../entity/films/entities/film.entity';
import { Person } from '../../entity/people/entities/person.entity';
import { Planet } from '../../entity/planet/entities/planet.entity';
import { Species } from '../../entity/species/entities/species.entity';
import { Starship } from '../../entity/starships/entities/starship.entity';
import { Vehicle } from '../../entity/vehicles/entities/vehicle.entity';
import { FilmRelationsDto } from '../../entity/films/dto/film-relations.dto';

export interface SeedDataInterface {
  films: Array<
    DeepPartial<Film> & { url: string } & {
      characters: string[];
      planets: string[];
      species: string[];
      starships: string[];
      vehicles: string[];
    }
  >;
  people: Array<
    DeepPartial<Person> & { url: string } & {
      homeworld: string;
      films: string[];
      species: string[];
      starships: string[];
      vehicles: string[];
    }
  >;
  planets: Array<
    DeepPartial<Planet> & { url: string } & {
      residents: string[];
      films: string[];
    }
  >;
  species: Array<
    DeepPartial<Species> & { url: string } & {
      homeworld: string;
      films: string[];
      people: string[];
    }
  >;
  starships: Array<
    DeepPartial<Starship> & { url: string } & {
      pilots: string[];
      films: string[];
    }
  >;
  vehicles: Array<
    DeepPartial<Vehicle> & { url: string } & {
      pilots: string[];
      films: string[];
    }
  >;
}
