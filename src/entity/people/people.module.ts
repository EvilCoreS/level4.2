import { Module } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleController } from './people.controller';
import { ImagesService } from '../../images/images.service';
import { PersonRepository } from './person.repository';
import { Person } from './entities/person.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from '../../file-services/file/file.service';
import { BucketService } from '../../file-services/bucket/bucket.service';

@Module({
  imports: [TypeOrmModule.forFeature([Person])],
  controllers: [PeopleController],
  providers: [
    PeopleService,
    ImagesService,
    PersonRepository,
    FileService,
    BucketService,
  ],
})
export class PeopleModule {}
