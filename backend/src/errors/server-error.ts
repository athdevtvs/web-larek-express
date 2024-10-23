import { Error } from 'mongoose';
import HttpStatus from '../constants/httpStatus';

class ServerError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  }
}

export default ServerError;
