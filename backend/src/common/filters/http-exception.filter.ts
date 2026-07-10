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
      ...(this.shouldExposeDetails(status) ? { details: errorDetails } : {}),
      ...(this.nodeEnv === 'production' ? {} : { stack }),
    })
  }

  private getClientMessage(exception: unknown, status: number): string {
    if (this.nodeEnv === 'production' && status >= 500) {
      return 'Internal server error'
    }

    if (exception instanceof HttpException) {
      return this.extractHttpExceptionMessage(exception)
    }

    return 'Internal server error'
  }

  private extractHttpExceptionMessage(exception: HttpException): string {
    const response = exception.getResponse()

    if (typeof response === 'string') {
      return response
    }

    if (typeof response === 'object' && response !== null && 'message' in response) {
      const message = (response as { message?: unknown }).message
      if (Array.isArray(message)) return message.join(', ')
      if (typeof message === 'string') return message
    }

    return exception.message
  }

  private shouldExposeDetails(status: number): boolean {
    return this.nodeEnv !== 'production' || status < 500
  }
}
