class AppError extends Error {
  public statusCode: number;
  public applicationCode: number;

  constructor(message: string, statusCode: number, applicationCode?: number) {
    super(message);
    this.statusCode = statusCode;
    this.applicationCode = applicationCode || statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
