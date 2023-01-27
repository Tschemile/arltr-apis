import { HttpException, HttpStatus } from '@nestjs/common';

export function BaseError(
  module: string,
  status: HttpStatus,
  message?: string,
) {
  let messageError = '';
  if (!message) {
    switch (status) {
      case HttpStatus.BAD_REQUEST: {
        if (module === 'User') {
          messageError = 'Username or password is incorrect';
        }
        messageError = `Your input of ${module} is invalid`;
      }
      case HttpStatus.FORBIDDEN: {
        messageError =  `You don't have permission to do with this ${module}`;
      }
      case HttpStatus.NOT_FOUND: {
        messageError =  `${module} not found`;
      }
      case HttpStatus.METHOD_NOT_ALLOWED: {
        messageError = `${module} still binding, cant do it`;
      }
      case HttpStatus.CONFLICT: {
        messageError = `${module} already exists`;
      }
      case HttpStatus.GONE: {
        messageError = `${module} unavailable`;
      }
      default: {
        messageError =  `Internal server error`;
      }
    }
  } else {
    messageError = message;
  }
  throw new HttpException(messageError, status);
}
