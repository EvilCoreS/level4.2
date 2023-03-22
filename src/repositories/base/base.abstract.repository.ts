import { BaseInterfaceRepository } from './base.interface.repository';
import { DeepPartial, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

export interface EntityInterface {
  id: number;
}

export abstract class BaseAbstractRepository<T extends EntityInterface>
  implements BaseInterfaceRepository<T>
{
  private entity: Repository<T>;

  protected constructor(entity: Repository<T>) {
    this.entity = entity;
  }
  public async save(data: DeepPartial<T>): Promise<T> {
    return await this.entity.save(data);
  }

  public async findOneById(id: any, relations?: string[]): Promise<T> {
    const findResult = await this.entity.findOne({
      where: { id },
      loadEagerRelations: false,
      relations,
    });
    if (!findResult) throw new NotFoundException('Incorrect id');
    return findResult;
  }
  public async findAll(
    offset: number,
    count: number,
    relations?: string[],
  ): Promise<T[]> {
    return await this.entity.find({
      skip: offset,
      take: count,
      relations,
    });
  }

  public async remove(id: any): Promise<T> {
    const findResult = await this.entity.findOneBy({ id });
    if (!findResult) throw new NotFoundException('Incorrect id');
    return await this.entity.remove(findResult);
  }
}
