import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs/promises';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        if (request.files) {
            (request.files as Express.Multer.File[]).forEach(async (file: Express.Multer.File) => {
                await fs.unlink(file.path);
            });
        }

        response.status(status).json({
            statusCode: status,
            message: exception.message,
            error: exception.name,
        });
    }
}
