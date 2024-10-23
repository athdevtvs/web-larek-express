import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/product';
import { MongoError } from '../types/error';
import moveFile from '../utils/moveFile';
import {
  BadRequestError,
  ConflictError,
  ServerError,
  NotFoundError,
  ValidationError,
  DuplicateKeyError,
} from '../errors';

export const getProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({});
    return res.send({ items: products, total: products.length });
  } catch (error) {
    if (error instanceof Error) {
      return next(
        new BadRequestError(`Ошибка при получении продуктов: ${error.message}`)
      );
    }
    return next(new ServerError('Произошла непредвиденная ошибка'));
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { title, image, category, description, price } = req.body;

  try {
    const isExist = await Product.findOne({ title });
    if (isExist) {
      return next(new ConflictError(`Продукт с названием "${title}" уже существует`));
    }

    await moveFile(image);
    const product = await Product.create({
      title,
      image,
      category,
      description,
      price,
    });

    if (!product) {
      return next(new NotFoundError('Товар не найден после создания'));
    }

    return res.status(201).send({ data: product });
  } catch (error) {
    const mongoError = error as MongoError;

    if (mongoError.code === 11000) {
      return DuplicateKeyError(mongoError, next);
    }

    if (error instanceof mongoose.Error.ValidationError) {
      return ValidationError(error, next);
    }

    return next(new ServerError(`Произошла непредвиденная ошибка: ${error}`));
  }
};
