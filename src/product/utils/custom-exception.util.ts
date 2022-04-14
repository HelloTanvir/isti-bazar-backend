import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request } from 'express';
import { deleteFile } from './delete-file.util';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const next = ctx.getNext();

        // delete files if body validation fails
        if (request.files) {
            (request.files as Express.Multer.File[]).forEach(async (file: Express.Multer.File) => {
                await deleteFile(file.path);
            });
        }

        next(exception);
    }
}
