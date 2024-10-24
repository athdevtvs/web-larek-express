import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/product';
import { MongoError } from '../types/error';
import HttpStatus from '../constants/httpStatus';
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

    return res.status(HttpStatus.CREATED).send({
      id: product._id,
      title: product.title,
      image: product.image,
      category: product.category,
      description: product.description,
      price: product.price,
    });
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

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;

  try {
    if (!productId) {
      return next(new BadRequestError('Id товара не указан.'));
    }

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return next(new BadRequestError('Нет товара по заданному id'));
    }

    return res.send(product);
  } catch (err) {
    return next(new ServerError(`Произошла ошибка при удалении товара: ${err}`));
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;

  if (!productId) {
    return next(new BadRequestError('Требуется корректный идентификатор товара'));
  }

  try {
    if (req.body?.image) {
      await moveFile(req.body.image);
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return next(new BadRequestError(`По заданному id товар отсутствует`));
    }

    return res.send(updatedProduct);
  } catch (err) {
    if (err instanceof Error && err.message.includes('E11000')) {
      return next(new ConflictError('Товар с таким заголовком уже существует'));
    }

    return next(new ServerError('Произошла ошибка при обновлении товара'));
  }
};
