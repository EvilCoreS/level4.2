import { SeedDataInterface } from '../common/interfaces/seed-data.interface';
import { PersonRepository } from '../entity/people/person.repository';
import { PlanetRepository } from '../entity/planet/planet.repository';
import { FilmRepository } from '../entity/films/film.repository';
import { VehiclesRepository } from '../entity/vehicles/vehicles.repository';
import { StarshipRepository } from '../entity/starships/starships.repository';
import { SpeciesRepository } from '../entity/species/species.repository';

export class RelationBuilder {
  public static data: SeedDataInterface = {
    films: [],
    people: [],
    planets: [],
    species: [],
    starships: [],
    vehicles: [],
  };

  public static returnEntity(name: string) {
    if (
      name === 'characters' ||
      name === 'people' ||
      name === 'pilots' ||
      name === 'residents'
    )
      return PersonRepository;
    if (name === 'planet' || name === 'homeworld') return PlanetRepository;
    switch (name) {
      case 'films':
        return FilmRepository;
      case 'vehicles':
        return VehiclesRepository;
      case 'starships':
        return StarshipRepository;
      case 'species':
        return SpeciesRepository;
    }
  }
}
