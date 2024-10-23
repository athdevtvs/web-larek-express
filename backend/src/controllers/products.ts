import { NextFunction, Request, Response } from 'express';
import Product from '../models/product';

export const getProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({});
    return res.send({ items: products, total: products.length });
  } catch (error) {
    if (error instanceof Error) {
      return next(`Ошибка при получении продуктов: ${error.message}`);
    }
    return next('Произошла непредвиденная ошибка');
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { title, image, category, description, price } = req.body;

  try {
    const isExist = await Product.findOne({ title });
    if (isExist) {
      return next(`Продукт с названием "${title}" уже существует`);
    }

    const product = await Product.create({
      title,
      image,
      category,
      description,
      price,
    });

    if (!product) {
      return next(console.error('Товар не найден после создания'));
    }

    return res.status(201).send({ data: product });
  } catch (error) {
    if (error instanceof Error) {
      return next(error);
    }
    return next(console.error('Произошла непредвиденная ошибка'));
  }
};
