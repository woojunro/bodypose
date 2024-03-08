import { v4 as uuidv4 } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';
import { extname } from 'path';

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
    return callback(
      new HttpException('ONLY_IMAGE_FILES_ALLOWED', HttpStatus.BAD_REQUEST),
      false,
    );
  }
  callback(null, true);
};

export const randomFileName = file => {
  const fileExtName = extname(file.originalname);
  const randomName = uuidv4();
  return `${randomName}${fileExtName}`;
};
