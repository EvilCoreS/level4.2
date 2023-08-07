import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { ImagesService } from '../../images/images.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { VehiclesRepository } from './vehicles.repository';
import { FileService } from '../../file-services/file/file.service';
import { BucketService } from '../../file-services/bucket/bucket.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle])],
  controllers: [VehiclesController],
  providers: [
    VehiclesService,
    ImagesService,
    VehiclesRepository,
    FileService,
    BucketService,
  ],
})
export class VehiclesModule {}
