import { celebrate, Segments, Joi } from 'celebrate';
import { IProduct } from '../models/product';

interface IOrder {
  items: string[];
  total: number;
  payment: 'card' | 'online';
  email: string;
  phone: string;
  address: string;
}

export const validateProduct = celebrate({
  [Segments.BODY]: Joi.object<IProduct>({
    title: Joi.string().min(2).max(30).required().messages({
      'string.base': 'Заголовок должен быть текстом',
      'string.empty': 'Заголовок не может быть пустым',
      'string.min': 'Заголовок должен быть длиной не менее {#limit} си символов',
      'string.max': 'Заголовок не может превышать {#limit} символов',
      'any.required': 'Заголовок обязателен',
    }),
    image: Joi.object({
      fileName: Joi.string()
        .regex(/\.(jpeg|jpg|png|gif|svg+xml)$/)
        .required()
        .messages({
          'string.base': 'Оригинальное имя должно быть строкой',
          'string.pattern.base':
            'Файл изображения должен иметь формат jpg, jpeg, png, gif или svg+xml',
          'string.empty': 'Оригинальное имя не может быть пустым',
          'any.required': 'Необходимо указать имя файла изображения',
        }),
      originalName: Joi.string().required().messages({
        'string.base': 'Оригинальное имя изображения должно быть строкой',
        'any.required': 'Необходимо указать оригинальное имя изображения',
        'string.empty': 'Оригинальное имя изображения не может быть пустым',
      }),
    })
      .required()
      .messages({
        'any.required': 'Поле image обязательно для заполнения',
      }),
    category: Joi.string().required().messages({
      'string.base': 'Поле category должно быть строкой',
      'string.empty': 'Поле category не может быть пустым',
      'any.required': 'Поле category обязательно для заполнения',
    }),
    description: Joi.string().optional(),
    price: Joi.number().positive().required().messages({
      'number.base': 'Цена должна быть числом',
      'number.positive': 'Цена должна быть положительным числом',
      'any.required': 'Цена обязательна',
    }),
  }),
});

export const validateOrder = celebrate({
  [Segments.BODY]: Joi.object<IOrder>({
    payment: Joi.string().valid('card', 'online').required().messages({
      'string.base': 'Поле payment должно быть строкой',
      'any.only': 'Оплата должна быть либо "картой", либо "онлайн"',
      'any.required': 'Требуется выбрать способ оплаты',
      'string.empty': 'Поле payment не может быть пустым',
    }),
    email: Joi.string().email().required().messages({
      'string.base': 'Email должен быть строкой',
      'string.email': 'Yкажите действительный адрес электронной почты',
      'any.required': 'Требуется указать адрес электронной почты.',
      'string.empty': 'Поле email не может быть пустым',
    }),
    phone: Joi.string()
      .regex(
        /^[+]?[0-9]?[.\s]?\(?[0-9]{3}\)?[.\s]?[0-9]{3}[-.\s]?[0-9]{2}[-.\s]?[0-9]{2}$/
      )
      .required()
      .messages({
        'string.base': 'Номер телефона должен быть строкой',
        'string.pattern.base': 'Номер телефона должен быть в допустимом формате',
        'any.required': 'Поле телефон обязательно для заполнения',
        'string.empty': 'Поле телефон не может быть пустым',
      }),
    address: Joi.string().required().messages({
      'string.base': 'Адрес должен быть строкой',
      'string.empty': 'Поле адрес не может быть пустым',
      'any.required': 'Поле address обязательно для заполнения',
    }),
    total: Joi.number().positive().required().messages({
      'number.base': 'Итоговая сумма должна быть числом',
      'number.positive': 'Итоговая сумма должна быть положительным числом',
      'any.required': 'Итоговая сумма обязательна для заполнения',
      'number.empty': 'Поле total не может быть пустым',
    }),
    items: Joi.array()
      .items(
        Joi.string().required().messages({
          'string.base': 'Каждый элемент должен быть строкой',
          'any.required': 'Каждый элемент обязателен для заполнения',
          'string.empty': 'Элемент не может быть пустым',
        })
      )
      .min(1)
      .required()
      .messages({
        'array.base': 'Поле items должно быть массивом',
        'array.min': 'Массив items должен содержать хотя бы {#limit} элемен',
        'any.required': 'Поле items обязательно для заполнения',
        'array.includesRequiredUnknowns':
          'Массив items должен содержать обязательные элементы',
      }),
  }),
});
