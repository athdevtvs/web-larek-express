import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import routes from './routes';
import errorHandler from './middlewares/error-handler';
import { errorLogger, requestLogger } from './middlewares/logger';
import { PORT, DB_ADDRESS, ORIGIN_ALLOW } from './config';

const app = express();
app.use(cookieParser());

const corsOptions = {
  // Указывает источник, которому разрешен доступ к ресурсу
  origin: ORIGIN_ALLOW,

  // Указывает, может ли ответ на запрос раскрывать учетные данные (например, файлы cookie)
  credentials: true,

  // Указывает, какие заголовки могут быть включены в запросы к серверу
  allowedHeaders: ['Authorization', 'Content-Type'],
};

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

app.use(cors(corsOptions));

app.use(express.json()); // Для разбора JSON
app.use(express.urlencoded({ extended: true })); // Для URL-кодированных запросов
app.use(express.static(path.join(__dirname, 'public'))); // Обслуживаем статические файлы

startServer();

app.use(requestLogger); // Добавляем регистратор запросов
app.use('/', routes); // Определяем маршруты
app.use(errorLogger); // Добавляем регистратор ошибок (он должен находится перед errorHandler)
app.use(errors()); // Обрабатываем ошибки проверки Celebrate
app.use(errorHandler); // Подключакм пользовательский обработчик ошибок
