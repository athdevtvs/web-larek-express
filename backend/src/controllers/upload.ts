import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { FileError } from '../errors';

const uploadFile = (req: Request, res: Response, _next: NextFunction) => {
  const { file } = req;

  if (!file) {
    return new FileError('Файл не был загружен');
  }

  const { filename, originalname } = file;
  const fileName = path.posix.join('/images', filename);

  return res.json({
    fileName,
    originalName: originalname,
  });
};

export default uploadFile;
