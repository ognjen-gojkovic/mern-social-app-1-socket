interface MyError {
  statusCode: number;
}

export class ErrorHandler extends Error implements MyError {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}
