import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateImageDto } from './dto/update-image.dto';
import { v4 as uuid } from 'uuid';
import * as fs from 'fs';
import dataSource from '../database/db.config';
import { Image } from './entities/image.entity';

export const PATH_TO_PUBLIC = 'src/database/public';
@Injectable()
export class ImagesService {
  uploadFile(files: Express.Multer.File[]) {
    const fileTypeRegExp = /(\.png)|(\.jpeg)|(\.jpg)$/;
    const filesInfo = [];
    files.map((file) => {
      const fileInfo = {
        file_name: uuid() + file.originalname.match(fileTypeRegExp)[0],
        original_name: file.originalname,
        date: new Date(),
      };
      filesInfo.push(fileInfo);
      fs.mkdir(`./${PATH_TO_PUBLIC}`, () => {
        fs.writeFileSync(
          `./${PATH_TO_PUBLIC}/${fileInfo.file_name}`,
          file.buffer,
        );
      });
    });
    return filesInfo;
  }

  async deleteImageById(id: number) {
    const image = await dataSource.manager.findOneBy(Image, { id: id });
    if (!image) throw new NotFoundException('Incorrect id');
    try {
      fs.unlinkSync(`./${PATH_TO_PUBLIC}/${image.file_name}`);
    } catch (e) {
      console.log(e);
    }
    return await dataSource.manager.remove(image);
  }

  async deleteImages(images: Image[]) {
    images.map((image) => {
      try {
        fs.unlinkSync(`./${PATH_TO_PUBLIC}/${image.file_name}`);
      } catch (e) {
        console.log(e);
      }
    });
    return await dataSource.manager.remove(images);
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
