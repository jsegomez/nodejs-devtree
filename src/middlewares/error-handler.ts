import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../utils/exceptions/exceptions';

import { validationResult, ValidationError } from 'express-validator';

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
      errors: validationErrors.array().map((err: ValidationError) => ({
        message: err.msg,
        field: err.type === 'field' ? err.path : 'unknown'
      }))
    });
  }

  if (error instanceof HttpException) {
    return res.status(error.statusCode).json({
      statusCode: error.statusCode,
      message: error.message,
      error: error.name
    });
  }
    
  return res.status(500).json({
    statusCode: 500,
    message: 'Error interno del servidor',
    error: 'InternalServerError'
  });
};

