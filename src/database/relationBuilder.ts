import { SeedDataInterface } from '../common/interfaces/seed-data.interface';
import { PersonRepository } from '../entity/people/person.repository';
import { PlanetRepository } from '../entity/planet/planet.repository';
import { FilmRepository } from '../entity/films/film.repository';
import { VehiclesRepository } from '../entity/vehicles/vehicles.repository';
import { StarshipRepository } from '../entity/starships/starships.repository';
import { SpeciesRepository } from '../entity/species/species.repository';
import { Person } from '../entity/people/entities/person.entity';
import { Planet } from '../entity/planet/entities/planet.entity';
import { Film } from '../entity/films/entities/film.entity';
import { Vehicle } from '../entity/vehicles/entities/vehicle.entity';
import { Starship } from '../entity/starships/entities/starship.entity';
import { Species } from '../entity/species/entities/species.entity';
import { plainToInstance } from 'class-transformer';

export class RelationBuilder {
  public static data: SeedDataInterface = {
    films: [],
    people: [],
    planets: [],
    species: [],
    starships: [],
    vehicles: [],
  };

  public static relationChecker = {
    films: [],
    people: [],
    planets: [],
    species: [],
    starships: [],
    vehicles: [],
  };

  public static returnEntity(name: string) {
    let entity;
    if (
      name === 'characters' ||
      name === 'people' ||
      name === 'pilots' ||
      name === 'residents'
    )
      entity = Person;
    if (name === 'planets' || name === 'homeworld') entity = Planet;
    switch (name) {
      case 'films':
        entity = Film;
        break;
      case 'vehicles':
        entity = Vehicle;
        break;
      case 'starships':
        entity = Starship;
        break;
      case 'species':
        entity = Species;
        break;
    }
    return entity;
  }

  public static getIdFromUrl(url: string) {
    return Number(url.split('/')[5]);
  }

  public static deleteRelations(entity: any) {
    const obj = {};
    Object.assign(obj, entity);
    delete obj['films'];
    delete obj['people'];
    delete obj['pilots'];
    delete obj['characters'];
    delete obj['residents'];
    delete obj['planet'];
    delete obj['homeworld'];
    delete obj['vehicles'];
    delete obj['starships'];
    delete obj['species'];
    delete obj['created'];
    delete obj['edited'];
    delete obj['url'];
    return obj;
  }

  public static getRelationName(name: string) {
    if (
      name === 'characters' ||
      name === 'people' ||
      name === 'pilots' ||
      name === 'residents'
    )
      return 'people';
    if (name === 'planets' || name === 'homeworld') return 'planets';
    switch (name) {
      case 'films':
        return 'films';
      case 'vehicles':
        return 'vehicles';
      case 'starships':
        return 'starships';
      case 'species':
        return 'species';
    }
  }

  public static addRelations(obj: object, name: string) {
    delete obj['url'];
    delete obj['created'];
    delete obj['edited'];
    Object.keys(obj).map((key) => {
      const entity = this.returnEntity(key);
      if (Array.isArray(obj[key])) {
        for (let i = 0; i < obj[key].length; i++) {
          const checkUrl = this.checkIsUrl(obj[key][i]);
          if (checkUrl) {
            const id = this.getIdFromUrl(obj[key][i]);
            obj[key][i] = plainToInstance(entity, {
              id,
            });
            if (
              this.relationChecker[this.getRelationName(key)].find(
                (number) => id === number,
              )
            )
              delete obj[key][i];
          }
        }
      } else {
        const checkUrl = this.checkIsUrl(obj[key]);
        if (checkUrl) {
          const id = this.getIdFromUrl(obj[key]);
          obj[key] = plainToInstance(entity, {
            id,
          });
          if (
            this.relationChecker[this.getRelationName(key)].find(
              (number) => id === number,
            )
          )
            delete obj[key];
        }
      }
    });
    this.relationChecker[name.toLowerCase()].push(obj['id']);
    return obj;
  }

  public static checkIsUrl(str: any) {
    if (typeof str === 'string') {
      const regExp = /^https?:\/\//;
      return regExp.test(str);
    } else return false;
  }
}
