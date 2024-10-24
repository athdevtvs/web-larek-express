import cron from 'node-cron';
import fs from 'fs/promises';
import path from 'path';
import { FileError } from '../errors';
import { UPLOAD_TEMP_PATH } from '../config';

const TEMP_DIR = path.join(__dirname, `../${UPLOAD_TEMP_PATH}`);
console.log(TEMP_DIR);

const deleteOldFiles = async () => {
  try {
    const files = await fs.readdir(TEMP_DIR);
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;

    await Promise.all(
      files.map(async file => {
        const filePath = path.join(TEMP_DIR, file);
        try {
          const stats = await fs.stat(filePath);
          const age = now - stats.mtimeMs;

          if (age > oneWeek) {
            await fs.unlink(filePath);
          }
        } catch (err) {
          if (err instanceof Error) {
            throw new FileError(`Ошибка при обработке файла ${filePath}: ${err.message}`);
          } else {
            throw new FileError(`Неизвестная ошибка при обработке файла ${filePath}`);
          }
        }
      })
    );
  } catch (err) {
    if (err instanceof Error) {
      throw new FileError(`Ошибка при чтении каталога ${TEMP_DIR}: ${err.message}`);
    } else {
      throw new FileError(`Неизвестная ошибка при чтении каталога ${TEMP_DIR}`);
    }
  }
};

cron.schedule('0 0 * * *', deleteOldFiles);
