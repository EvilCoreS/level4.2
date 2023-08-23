import { plainToInstance } from 'class-transformer';
import { SeedDataInterface } from '../src/common/interfaces/seed-data.interface';
import { Person } from '../src/entity/people/entities/person.entity';
import { Planet } from '../src/entity/planet/entities/planet.entity';
import { Film } from '../src/entity/films/entities/film.entity';
import { Vehicle } from '../src/entity/vehicles/entities/vehicle.entity';
import { Starship } from '../src/entity/starships/entities/starship.entity';
import { Species } from '../src/entity/species/entities/species.entity';
import axios from 'axios';

interface SwapiResponse {
  count: number;
  next: string;
  results: { [key: string]: any }[];
}

export class RelationBuilder {
  public static start = Date.now();

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

  public static async fetchData(name: string, page = 1, results = []) {
    const url = `https://swapi.dev/api/${name}/?format=json&page=${page}`;
    const response: SwapiResponse = await axios
      .get(url)
      .then((res) => res.data);
    results.push(
      ...response.results.map((entity) => {
        return {
          id: this.getIdFromUrl(entity['url']),
          ...entity,
        };
      }),
    );
    if (!!response.next) {
      await this.fetchData(name, ++page, results);
    } else {
      this.data[name] = results;
      return results;
    }
  }

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
    const allRelations = [
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
    const obj = Object.assign({}, entity);

    allRelations.map((name) => {
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
    const entity = this.returnEntity(name);
    return plainToInstance(entity, obj);
  }

  public static checkIsUrl(str: any) {
    if (typeof str === 'string') {
      const regExp = /^https?:\/\//;
      return regExp.test(str);
    } else return false;
  }
}
