import { Request } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { UPLOAD_TEMP_PATH } from '../config';

const TEMP_DIR = path.join(__dirname, `../${UPLOAD_TEMP_PATH}`);

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR);
}

// Настройка multer для сохранения файлов во временную директорию
const storage = multer.diskStorage({
  destination: (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, TEMP_DIR); // Сохраняем файлы во временную директорию
  },
  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension); // Создаём уникальное имя файла
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/',
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Разрешаем загрузку файла
  } else {
    cb(null, false);
  }
};

// Создаём multer middleware
const fileMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Ограничение размера файла: 5MB
  fileFilter,
});

export default fileMiddleware;
