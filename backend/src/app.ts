import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import routes from './routes';

dotenv.config();
const { PORT = 3000, DB_ADDRESS = 'mongodb://localhost:27017/weblarek' } = process.env;
const app = express();

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_ADDRESS);
    console.log('Подключение к MongoDB выполнено успешно');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Ошибка подключения к MongoDB: ', error.message);
    } else {
      console.error('Произошла непредвиденная ошибка: ', error);
    }
    process.exit(1);
  }
};

const startServer = async () => {
  await connectToDatabase();

  app.listen(+PORT, () => {
    console.log(`Приложение прослушивает порт ${PORT}`);
  });
};

app.use(cors());

app.use(express.json()); // Для разбора JSON
app.use(express.urlencoded({ extended: true })); // Для URL-кодированных запросов
app.use(express.static(path.join(__dirname, 'public'))); // Обслуживаем статические файлы

startServer();

app.use('/', routes); // Определяем маршруты
