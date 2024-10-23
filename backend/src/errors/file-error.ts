import mongoose from 'mongoose';

class FileError extends mongoose.Error {
  constructor(message: string) {
    super(message);
    Object.defineProperty(this, 'name', { value: 'FileError', writable: false });
  }
}

export default FileError;
