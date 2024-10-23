import { Error } from 'mongoose';
import HttpStatus from '../constants/httpStatus';

class ConflictError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatus.CONFLICT;
  }
}

export default ConflictError;
