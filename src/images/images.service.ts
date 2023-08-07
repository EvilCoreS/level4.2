import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateImageDto } from './dto/update-image.dto';
import { v4 as uuid } from 'uuid';
import { Image } from './entities/image.entity';
import dataSource from '../../database/db.datasource';

import { plainToClassFromExist } from 'class-transformer';
import { FileService } from '../file-services/file/file.service';
import { BucketService } from '../file-services/bucket/bucket.service';
import * as path from 'path';

export const PATH_TO_PUBLIC = path.resolve(
  __dirname,
  '../',
  '../',
  '../',
  './public',
);
@Injectable()
export class ImagesService {
  constructor(
    private fileService: FileService,
    private bucketService: BucketService,
  ) {}
  async uploadFile(files: Express.Multer.File[]) {
    const fileTypeRegExp = /(\.png)|(\.jpeg)|(\.jpg)$/;
    const filesInfo: Image[] = [];
    await Promise.all(
      files.map(async (file) => {
        const fileName = uuid() + file.originalname.match(fileTypeRegExp)[0];
        const link = await this.bucketService.addFile(
          fileName,
          file.buffer,
          file.mimetype,
        );

        const fileInfo = {
          file_name: fileName,
          original_name: file.originalname,
          date: new Date(),
          aws_link: link,
        };

        filesInfo.push(plainToClassFromExist(new Image(), fileInfo));
        this.fileService.addFile(fileName, file.buffer);
      }),
    );
    return filesInfo;
  }

  async deleteImageById(id: number) {
    const image = await dataSource.manager.findOneBy(Image, { id: id });
    if (!image) throw new NotFoundException('Incorrect id');

    this.fileService.deleteFile(image.file_name);
    return dataSource.manager.remove(image);
  }

  async deleteImages(images: Image[]) {
    images.map((image) => {
      this.fileService.deleteFile(image.file_name);
      this.bucketService.deleteFile(image.file_name);
    });
    return dataSource.manager.remove(images);
  }

  async findAll() {
    return `This action returns all images`;
  }

  findOne(id: number) {
    return `This action returns a #${id} image`;
  }

  update(id: number, updateImageDto: UpdateImageDto) {
    return `This action updates a #${id} image`;
  }

  remove(id: number) {
    return `This action removes a #${id} image`;
  }
}
