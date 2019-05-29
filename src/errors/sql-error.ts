import { IAppError } from '../types/errors';

export class SQLError extends Error implements IAppError {
  public status = 500;
  public message = '';
  constructor(message: string) {
    super(message);
    this.message = message;
  }
}
