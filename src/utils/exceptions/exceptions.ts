export class HttpException extends Error {
  public statusCode: number;
  public override message: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.name = this.constructor.name;
  }
}

export class NotFoundException extends HttpException {
  constructor(message: string = 'Recurso no encontrado') {
    super(message, 404);
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string = 'Solicitud incorrecta') {
    super(message, 400);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string = 'No autorizado') {
    super(message, 401);
  }
}

export class ConflictException extends HttpException {
  constructor(message: string = 'Conflicto') {
    super(message, 409);
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message: string = 'Error interno del servidor') {
    super(message, 500);
  }
}

export class TokenExpiredException extends HttpException {
  constructor(message: string = 'Token expirado') {
    super(message, 401);
  }
}

export class InvalidTokenException extends HttpException {
  constructor(message: string = 'Token inválido') {
    super(message, 401);
  }
}