import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { UserInputError } from 'apollo-server-express';

@Catch(BadRequestException)
export class BadRequestFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ret = new UserInputError(exception.message);
    ret.extensions = {
      response: exception.getResponse(),
      ...ret.extensions,
    };
    return ret;
  }
}
