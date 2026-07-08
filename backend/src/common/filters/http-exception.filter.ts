import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  constructor(private readonly nodeEnv = 'development') {}

  catch(exception: unknown, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest<Request>()
    const response = host.switchToHttp().getResponse<Response>()
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR
    const errorDetails = exception instanceof HttpException ? exception.getResponse() : null
    const stack = exception instanceof Error ? exception.stack : undefined
    const message = this.getClientMessage(exception, status)

    this.logger.error(
      `${request.method} ${request.originalUrl} failed with ${status}`,
      stack || String(exception),
    )

    response.status(status).json({
      ok: false,
      data: null,
      error: message,
      statusCode: status,
      ...(this.nodeEnv === 'production' ? {} : { details: errorDetails, stack }),
    })
  }

  private getClientMessage(exception: unknown, status: number): string {
    if (this.nodeEnv === 'production') {
      return status >= 500 ? 'Internal server error' : 'Request failed'
    }

    if (exception instanceof HttpException) {
      return exception.message
    }

    return 'Internal server error'
  }
}
