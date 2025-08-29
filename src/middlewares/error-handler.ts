import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../utils/exceptions/exceptions';

import { validationResult } from 'express-validator';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.status(400).json({
      statusCode: 400,      
      error: 'ValidationError',
      errors: validationErrors.array()
    });
  }

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

