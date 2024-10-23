import { faker } from '@faker-js/faker';
import { NextFunction, Request, Response } from 'express';
import Product from '../models/product';

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { items, total } = req.body; // элементы -- это массив с _id'ми товаров

  try {
    // Проверим, что массив с элементами не пуст
    if (!Array.isArray(items) || items.length === 0) {
      return next('Массив элементов не может быть пустым');
    }

    const invalidProductIds: string[] = [];
    const missingOrUnavailableProducts: string[] = [];

    // Проверим идентификаторы элементов на недопустимый формат MongoDB ObjectId
    const validItemIds = items.filter(itemId => {
      if (!itemId.match(/^[0-9a-fA-F]{24}$/)) {
        invalidProductIds.push(itemId);
        return false;
      }
      return true;
    });

    if (invalidProductIds.length > 0) {
      return next(`Неверные id продуктов: ${invalidProductIds.join(', ')}`);
    }

    const products = await Product.find({
      _id: { $in: validItemIds },
      price: { $ne: null }, // у товара есть цена (он для продажи)
    });

    // Определим отсутствущие или недоступные товары и если такие есть,
    // то вернем ошибку
    const foundProductIds = products.map(product => product._id.toString());
    missingOrUnavailableProducts.push(
      ...validItemIds.filter(itemId => !foundProductIds.includes(itemId))
    );
    if (missingOrUnavailableProducts.length > 0) {
      return next(
        `Товары с id не найдены или не продаются: ${missingOrUnavailableProducts.join(', ')}`
      );
    }

    // Рассчитываем общую стоимость на основе цен на товары и проверяем
    // cоответствует ли рассчитанная сумма ожидаемой сумме из запроса
    const actualTotal = products.reduce((acc, product) => acc + product.price, 0);
    if (actualTotal !== total) {
      return next('Неправильная сумма заказа');
    }

    // Создаем заказ (имитация реализации)
    const orderId = faker.number.hex({ min: 1000000000, max: 9999999999 });

    return res.status(200).send({
      id: orderId,
      total,
    });
  } catch (error) {
    return next(`Ошибка сервера: ${JSON.stringify(error)}`);
  }
};

export default createOrder;
