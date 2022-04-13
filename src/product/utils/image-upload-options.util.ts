import { ForbiddenException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const imageUploadOptions: MulterOptions = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            cb(null, './uploads/products');
        },
        filename: (req, file, cb) => {
            const fileExt = extname(file.originalname);
            const fileName =
                file.originalname.replace(fileExt, '').toLowerCase().split(' ').join('-') +
                '-' +
                Date.now();

            cb(null, fileName + fileExt);
        },
    }),
    limits: {
        fileSize: 1000000,
    },
    fileFilter: (req, file, cb) => {
        if (['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new ForbiddenException('Only .jpg, jpeg or .png format allowed!'), false);
        }
    },
};
