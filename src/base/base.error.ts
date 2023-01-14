import { HttpException, HttpStatus } from "@nestjs/common";

export function BaseError(module: string, status: HttpStatus) {
  switch(status) {
    case HttpStatus.BAD_REQUEST: {
      if (module === 'User') {
        throw new HttpException('Username or password is incorrect', status)
      }
      throw new HttpException(`Your input of ${module} is invalid`, status)
    }
    case HttpStatus.FORBIDDEN: {
      throw new HttpException(`You don't have permission to do with this ${module}`, status)
    }
    case HttpStatus.NOT_FOUND: {
      throw new HttpException(`${module} not found`, status)
    }
    case HttpStatus.METHOD_NOT_ALLOWED: {
      throw new HttpException(`${module} still binding, cant do it`, status)
    }
    case HttpStatus.CONFLICT: {
      throw new HttpException(`${module} already exists`, status)
    }
    case HttpStatus.GONE: {
      throw new HttpException(`${module} unavailable`, status)
    }
    default: {
      throw new HttpException(`Internal server error`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}