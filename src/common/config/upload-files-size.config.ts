import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

export const uploadFilesSizeConfig = (maxSize) =>
  new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize }),
      new FileTypeValidator({ fileType: /\/(png)|(jpg)|(jpeg)$/ }),
    ],
  });
