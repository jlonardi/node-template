import { IAppError } from '../types/errors';

export class PromiseRejectionError extends Error implements IAppError {
  public status = 500;
  public message = '';
  constructor(error: Error) {
    super();
    this.message = 'Promise rejection' + error.stack;
  }
}
