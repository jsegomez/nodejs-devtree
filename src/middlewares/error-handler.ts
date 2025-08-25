import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../utils/exceptions/exceptions';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof HttpException) {
    return res.status(error.statusCode).json({
      statusCode: error.statusCode,
      message: error.message,
      error: error.name
    });
  }
  
  console.error(error);
  return res.status(500).json({
    statusCode: 500,
    message: 'Error interno del servidor',
    error: 'InternalServerError'
  });
};

