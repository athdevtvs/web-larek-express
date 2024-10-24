import { CookieOptions, NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import { UnauthorizedError, ConflictError, NotFoundError, ServerError } from '../errors';
import ErrorMessage from '../constants/errorMessage';
import {
  AUTH_ACCESS_TOKEN_EXPIRY,
  AUTH_JWT_SECRET_KEY,
  AUTH_REFRESH_TOKEN_EXPIRY,
} from '../config';
import { userModel } from '../models/user';
import { UserRequest } from '../types/user';

const cookieOptions: CookieOptions = {
  // Предотвращает доступ клиента к cookie-файлам
  // для повышения безопасности от XSS
  httpOnly: true,

  // Контролирует отправку файлов cookie с кросс-доменными запросами
  // для повышения безопасности при сохранении удобства использования
  sameSite: 'lax',

  // Гарантирует, что cookie-файлы отправляются только
  // по защищенным соединениям, защищая их от перехвата
  secure: true,

  // Определяет, как долго cookie-файл будет оставаться
  // действительным до истечения срока его действия
  maxAge: ms(AUTH_REFRESH_TOKEN_EXPIRY),

  // Определяет URL-адрес, по которому действителен файл cookie
  path: '/',
};

const authResponse = async (res: Response, userId: string) => {
  const accessToken = jwt.sign({ _id: userId }, AUTH_JWT_SECRET_KEY, {
    expiresIn: AUTH_ACCESS_TOKEN_EXPIRY,
  });
  const refreshToken = jwt.sign({ _id: userId }, AUTH_JWT_SECRET_KEY, {
    expiresIn: AUTH_REFRESH_TOKEN_EXPIRY,
  });

  const { email, name } = await userModel.updateTokens(userId, accessToken, refreshToken);

  res.cookie('refreshToken', refreshToken, cookieOptions);
  return res.send({
    user: {
      email,
      name,
    },
    success: true,
    accessToken,
  });
};

export const getCurrentUser = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || !req.user._id) {
      return next(new UnauthorizedError('Пользователь не авторизован'));
    }

    const matchedUser = await userModel.findById(req.user._id);

    if (!matchedUser) {
      return next(new NotFoundError(ErrorMessage.USER_NOT_FOUND));
    }

    return res.send({
      user: {
        name: matchedUser.name,
        email: matchedUser.email,
      },
      success: true,
    });
  } catch (error) {
    return next(
      new ServerError(
        `Ошибка сервера при поиске текущего пользователя: ${
          error instanceof Error ? error.message : JSON.stringify(error)
        }`
      )
    );
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name = 'John Doe' } = req.body;

  try {
    const hashedPassword = await userModel.hashPassword(password);
    const newUser = await userModel.create({ email, password: hashedPassword, name });

    return authResponse(res, String(newUser._id));
  } catch (error) {
    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError('Пользователь с таким email уже существует'));
    }

    return next(
      new ServerError(
        `Ошибка сервера при регистрации пользователя: ${
          error instanceof Error ? error.message : JSON.stringify(error)
        }`
      )
    );
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findUserByCredentials(email, password);

    if (!user) {
      return next(new UnauthorizedError(ErrorMessage.INCORRECT_CREDENTIALS));
    }

    return authResponse(res, String(user._id));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('Неправильные почта или пароль')
    ) {
      return next(new UnauthorizedError(error.message));
    }

    return next(
      new ServerError(
        `Ошибка сервера при логине пользователя: ${
          error instanceof Error ? error.message : JSON.stringify(error)
        }`
      )
    );
  }
};

export const refreshAccessToken = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return next(new UnauthorizedError('Refresh токен не предоставлен'));
  }

  try {
    const user = await userModel.findOne({ 'tokens.refreshToken': refreshToken });

    if (!user) {
      return next(new NotFoundError(ErrorMessage.USER_NOT_FOUND));
    }

    return authResponse(res, String(user._id));
  } catch (error) {
    return next(
      new ServerError(
        `Ошибка сервера при обновлении токена: ${
          error instanceof Error ? error.message : JSON.stringify(error)
        }`
      )
    );
  }
};

export const logout = async (req: UserRequest, res: Response, next: NextFunction) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return next(new UnauthorizedError('Refresh токен не предоставлен'));
  }

  try {
    const user = await userModel.findOne({ 'tokens.refreshToken': refreshToken });

    if (!user) {
      return next(new NotFoundError(ErrorMessage.USER_NOT_FOUND));
    }

    // Очищаем refresh токен для пользователя
    user.tokens = user.tokens.filter(token => token.refreshToken !== refreshToken);
    await user.save();

    // Очищаем cookie, устанавливая maxAge в 0
    res.cookie('refreshToken', '', { ...cookieOptions, maxAge: 0 });

    return res.send({ success: true });
  } catch (err) {
    return next(
      new ServerError(
        `Ошибка сервера при разлогине пользователя: ${
          err instanceof Error ? err.message : JSON.stringify(err)
        }`
      )
    );
  }
};
