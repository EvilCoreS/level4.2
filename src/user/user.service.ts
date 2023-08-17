import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';
import { plainToClassFromExist, plainToInstance } from 'class-transformer';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { UpdateUserDto } from './dto/update-user.dto';
import dataSource from '../../database/db.datasource';

@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto) {
    return dataSource.manager.save(plainToInstance(User, createUserDto));
  }

  async paginate(options: IPaginationOptions) {
    return paginate(dataSource.getRepository(User), options);
  }

  async findAll(offset = 0, count = 10) {
    return dataSource.manager.find(User, {
      skip: offset,
      take: count,
      loadEagerRelations: false,
    });
  }

  async findOne(id: number) {
    const user = await dataSource.manager.findOne(User, {
      where: { id },
      loadEagerRelations: false,
    });
    if (!user) throw new BadRequestException();
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    return dataSource.manager.save(plainToClassFromExist(user, updateUserDto));
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return dataSource.manager.remove(user);
  }

  findByUsername(username: string) {
    return dataSource.manager.findOne(User, {
      where: { username },
    });
  }
}
