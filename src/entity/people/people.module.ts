import { Module } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleController } from './people.controller';
import { PeopleRepository } from './people.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Person])],
  controllers: [PeopleController],
  providers: [
    PeopleService,
    { provide: 'PeopleRepositoryInterface', useClass: PeopleRepository },
  ],
})
export class PeopleModule {}
