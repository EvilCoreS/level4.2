import { Inject, Injectable } from '@nestjs/common';
import { CreatePlanetDto } from './dto/create-planet.dto';
import { UpdatePlanetDto } from './dto/update-planet.dto';
import { plainToClassFromExist, plainToInstance } from 'class-transformer';
import { ImagesService } from '../../images/images.service';
import { Planet } from './entities/planet.entity';
import { PlanetRelationsDto } from './dto/planet-relations.dto';
import { relationsSaver } from '../../common/functions/relations-saver';
import { PlanetRepository } from './planet.repository';
@Injectable()
export class PlanetService {
  constructor(
    private imageService: ImagesService,
    @Inject(PlanetRepository) private planetRepository: PlanetRepository,
  ) {}

  async create(createPlanetDto: CreatePlanetDto, files: Express.Multer.File[]) {
    const filesInfo = await this.imageService.uploadFile(files);
    const objToSave = plainToInstance(Planet, createPlanetDto);
    objToSave.images = filesInfo;
    return this.planetRepository.save(objToSave);
  }

  async findAll(offset = 0, count = 10) {
    return this.planetRepository.findAll(offset, count, [
      'residents',
      'images',
      'films',
    ]);
  }

  async findOne(id: number) {
    return this.planetRepository.findOneById(id, [
      'residents',
      'images',
      'films',
    ]);
  }

  async update(
    id: number,
    updatePlanetDto: UpdatePlanetDto,
    files: Express.Multer.File[],
  ) {
    const planet = await this.planetRepository.findOneById(id, ['images']);
    const newImages = await this.imageService.uploadFile(files);
    newImages.map((newImage) => {
      console.log(planet.images);
      const findIndex = planet.images.findIndex(
        (image) => image.original_name === newImage.original_name,
      );
      if (findIndex >= 0) {
        this.imageService.deleteImages([planet.images[findIndex]]);
        plainToClassFromExist(planet.images[findIndex], newImage);
      } else planet.images.push(newImage);
    });
    return this.planetRepository.save(
      plainToClassFromExist(planet, updatePlanetDto),
    );
  }

  async remove(id: number) {
    const deleteInfo = await this.planetRepository.remove(id);
    await this.imageService.deleteImages(deleteInfo.images);
    return deleteInfo;
  }

  async addRelations(dto: PlanetRelationsDto, id: number) {
    return relationsSaver(Planet, dto, id);
  }
}
