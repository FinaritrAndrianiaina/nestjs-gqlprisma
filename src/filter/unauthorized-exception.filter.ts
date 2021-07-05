import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticationError } from 'apollo-server-express';

@Catch(UnauthorizedException)
export class UnauthorizedFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ret = new AuthenticationError(exception.message);
    ret.extensions = {
      ...ret.extensions,
      response: exception.getResponse(),
    };
    return ret;
  }
}
