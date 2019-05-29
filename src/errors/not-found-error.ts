import { IAppError } from '../types/errors';

export class NotFoundError extends Error implements IAppError {
  public status = 404;
  public message = '';
  constructor(message: string) {
    super(message);
    this.message = message;
  }
}
