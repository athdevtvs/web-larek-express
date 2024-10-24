import { promises as fsPromises } from 'fs';
import path from 'path';
import { UPLOAD_TARGET_PATH, UPLOAD_TEMP_PATH } from '../config';
import { FileError } from '../errors';

export type TMoveFile = {
  fileName: string;
  originalName: string;
};

const moveFile = async (image: TMoveFile): Promise<void> => {
  const fileName = path.basename(image.fileName);
  const tempPath = path.join(__dirname, `../${UPLOAD_TEMP_PATH}`, fileName);
  const targetPath = path.join(__dirname, '../public', `${UPLOAD_TARGET_PATH}`, fileName);

  try {
    return await fsPromises.rename(tempPath, targetPath);
  } catch (error) {
    throw new FileError(`Не удалось переместить файл: ${(error as Error).message}`);
  }
};

export default moveFile;
