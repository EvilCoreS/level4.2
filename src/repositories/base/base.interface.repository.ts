import { EntityInterface } from './base.abstract.repository';
import { DeepPartial } from 'typeorm';

export interface BaseInterfaceRepository<T extends EntityInterface> {
  save(dto: DeepPartial<T>): Promise<T>;

  findOneById(id: number, relations?: string[]): Promise<T>;

  findAll(offset: number, count: number, relations?: string[]): Promise<T[]>;

  remove(id: number): Promise<T>;
}
