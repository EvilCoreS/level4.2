import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { ImagesService } from '../../images/images.service';

@Module({
  controllers: [VehiclesController],
  providers: [VehiclesService, ImagesService],
})
export class VehiclesModule {}
