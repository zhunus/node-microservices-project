import { ValidationError } from 'express-validator';
import CustomError from './custom-error';

export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super('Request validation failure');

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((item) => ({
      message: item.msg,
      field: item.param,
    }));
  }
}
