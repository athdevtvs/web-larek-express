import { model, Schema } from 'mongoose';
import { promises as fs } from 'fs';
import path from 'path';
import { FileError } from '../errors';

export interface IProduct {
  title: string;
  image: { fileName: string; originalName: string };
  category: string;
  description: string;
  price: number;
}

const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    unique: true,
  },
  image: {
    type: { fileName: String, originalName: String },
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: false,
    default: null,
  },
});

productSchema.post('findOneAndDelete', async doc => {
  if (doc.image) {
    const filePath = path.join(__dirname, '../public', doc.image.fileName);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      throw new FileError(`Ошибка при удалении файла: + err`);
    }
  }
});

const product = model<IProduct>('product', productSchema);

export default product;
