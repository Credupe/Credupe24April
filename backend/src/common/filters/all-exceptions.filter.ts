import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let code: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resp: any = exception.getResponse();
      if (typeof resp === 'string') message = resp;
      else {
        message = resp?.message ?? exception.message;
        code = resp?.error;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      // Prisma unique violation
      if ((exception as any).code === 'P2002') {
        status = HttpStatus.CONFLICT;
        code = 'UNIQUE_VIOLATION';
      }
      // express body-parser: payload too large
      if ((exception as any).type === 'entity.too.large') {
        status = HttpStatus.PAYLOAD_TOO_LARGE;
        code = 'PAYLOAD_TOO_LARGE';
      }
    }

    if (status >= 500) {
      this.logger.error(
        `[${req?.method} ${req?.url}] ${status} ${JSON.stringify(message)}`,
        (exception as any)?.stack,
      );
    }

    res.status(status).json({
      success: false,
      data: null,
      error: {
        code: code ?? HttpStatus[status] ?? 'ERROR',
        status,
        message: Array.isArray(message) ? message : [message],
      },
    });
  }
}
