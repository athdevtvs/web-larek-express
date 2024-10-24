import { Schema, model, Model, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { UnauthorizedError, NotFoundError } from '../errors';
import ErrorMessage from '../constants/errorMessage';

const SALT_ROUNDS = 10;

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  tokens: {
    accessToken: string;
    refreshToken: string;
  }[];
}

interface UserModel extends Model<IUser> {
  findUserByCredentials: (email: string, password: string) => Promise<IUser | null>;
  hashPassword: (password: string) => Promise<string>;
  updateTokens: (
    id: string,
    accessToken: string,
    refreshToken: string
  ) => Promise<{
    email: string;
    name: string;
  }>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Ё-мое',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\S+@\S+\.\S+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    tokens: [
      {
        accessToken: {
          type: String,
          required: true,
          select: false,
        },
        refreshToken: {
          type: String,
          required: true,
          select: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.statics.findUserByCredentials = async (email: string, password: string) => {
  // eslint-disable-next-line no-use-before-define
  const user = await userModel.findOne({ email }).select('+password');
  if (!user) {
    throw new UnauthorizedError(ErrorMessage.INCORRECT_CREDENTIALS);
  }

  const passwdMatch = await bcrypt.compare(password, user.password);
  if (!passwdMatch) {
    throw new UnauthorizedError(ErrorMessage.INCORRECT_CREDENTIALS);
  }

  return user;
};

userSchema.statics.hashPassword = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error(`Ошибка при хешировании пароля: ${(error as Error).message}`);
  }
};

userSchema.statics.updateTokens = async function updateTokens(
  userId: string,
  accessToken: string,
  refreshToken: string
) {
  const user = await this.findById(userId);

  if (!user) {
    return new NotFoundError(ErrorMessage.USER_NOT_FOUND);
  }

  user.tokens[0] = { accessToken, refreshToken };
  await user.save();

  return user;
};

export const userModel = model<IUser, UserModel>('user', userSchema);
