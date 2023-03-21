import dataSource from '../../database/db.config';
import { BadRequestException } from '@nestjs/common';
import { plainToClassFromExist } from 'class-transformer';
import { EntityTarget } from 'typeorm';

export async function relationsSaver<T extends EntityTarget<{ id: number }>, U>(
  entity: T,
  dto: U,
  id: number,
) {
  const findTarget = await dataSource.manager.findOne(entity, {
    where: { id },
    loadEagerRelations: false,
  });
  if (!findTarget) throw new BadRequestException('Incorrect id');
  const toAddObj = plainToClassFromExist(findTarget, dto);
  Object.keys(toAddObj).map((key) => {
    if (Array.isArray(toAddObj[key])) {
      const newArr = [];
      for (const item of toAddObj[key]) {
        newArr.push({ id: item });
      }
      toAddObj[key] = newArr;
    }
  });
  return await dataSource.manager.save(toAddObj);
}