import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class FileUploadExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception instanceof Error ? 400 : 500;

    console.error('Unhandled Exception in FileUpload:', exception);

    response.status(status).json({
      message: exception.message || 'File upload failed!',
    });
  }
}
