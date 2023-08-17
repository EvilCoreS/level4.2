import { SeedDataInterface } from '../src/common/interfaces/seed-data.interface';
import { Person } from '../src/entity/people/entities/person.entity';
import { Planet } from '../src/entity/planet/entities/planet.entity';
import { Film } from '../src/entity/films/entities/film.entity';
import { Vehicle } from '../src/entity/vehicles/entities/vehicle.entity';
import { Starship } from '../src/entity/starships/entities/starship.entity';
import { Species } from '../src/entity/species/entities/species.entity';
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

  public static total = {
    films: -1,
    people: -1,
    planets: -1,
    species: -1,
    starships: -1,
    vehicles: -1,
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

  public static getNameEntity(url: string) {
    return url.split('/')[4];
  }

  public static deleteRelations(entity: any) {
    const names = [
      'films',
      'people',
      'pilots',
      'characters',
      'residents',
      'planet',
      'homeworld',
      'vehicles',
      'starships',
      'species',
      'created',
      'edited',
      'url',
    ];
    const obj = {};
    Object.assign(obj, entity);
    names.map((name) => {
      delete obj[name];
    });

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
