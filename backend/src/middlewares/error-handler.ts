import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { MongoError } from '../types/error';

const errorHandler: ErrorRequestHandler = (
  error: MongoError,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode ?? 500;
  const message = error.message ?? 'Внутренняя ошибка сервера';

  res.status(statusCode).send({ statusCode, message });
  next();
};

export default errorHandler;
