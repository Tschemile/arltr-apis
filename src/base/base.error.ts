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
        messageError = `Your input of ${module} is invalid`;
        break
      }
      case HttpStatus.FORBIDDEN: {
        messageError =  `You don't have permission to do with this ${module}`;
        break
      }
      case HttpStatus.NOT_FOUND: {
        messageError =  `${module} not found`;
        break
      }
      case HttpStatus.METHOD_NOT_ALLOWED: {
        messageError = `${module} still binding, cant do it`;
        break
      }
      case HttpStatus.CONFLICT: {
        messageError = `${module} already exists`;
        break
      }
      case HttpStatus.GONE: {
        messageError = `${module} unavailable`;
        break
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
