export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Yetkisiz erişim') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Erişim yasak') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Kaynak bulunamadı') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Çakışma') {
    super(message, 409);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Doğrulama hatası') {
    super(message, 400);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Sunucu hatası') {
    super(message, 500);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Geçersiz istek') {
    super(message, 400);
  }
}
