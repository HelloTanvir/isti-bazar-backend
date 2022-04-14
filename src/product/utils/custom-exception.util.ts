import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request } from 'express';
import * as fs from 'fs/promises';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const next = ctx.getNext();

        if (request.files) {
            (request.files as Express.Multer.File[]).forEach(async (file: Express.Multer.File) => {
                await fs.unlink(file.path);
            });
        }

        next(exception);
    }
}
