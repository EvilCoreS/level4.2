import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { PATH_TO_PUBLIC } from '../../images/images.service';

@Injectable()
export class FileService {
  addFile(name: string, buffer: Buffer) {
    fs.writeFileSync(`${PATH_TO_PUBLIC}/${name}`, buffer);
  }

  deleteFile(name: string) {
    try {
      fs.unlinkSync(`${PATH_TO_PUBLIC}/${name}`);
    } catch (e) {
      console.log(e);
    }
  }
}
