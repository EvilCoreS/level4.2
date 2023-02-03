import { Repository } from 'typeorm';
import { GeneralRepositoryInterface } from './general.repository.interface';

export class GeneralRepository<T> implements GeneralRepositoryInterface<T> {
  private entity: Repository<T>;
  protected constructor(entity: Repository<T>) {
    this.entity = entity;
  }
  public async findByID(id: number) {
    return await this.entity.findOneById(id);
  }
  public create(data: T) {
    return this.entity.create(data);
  }

  public async save(data: T) {
    return await this.entity.save(data);
  }

  public async remove(data: T) {
    return await this.entity.remove(data);
  }

  public async preload(data: T) {
    return await this.entity.preload(data);
  }
}
