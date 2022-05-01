import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    // app.use((req: Request, res: Response, next: NextFunction) => {
    //     res.header(
    //         'Access-Control-Allow-Origin',
    //         'https://isti-bazar.vercel.app,http://localhost:3000'
    //     );
    //     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    //     res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    //     next();
    // });

    // app.enableCors({
    //     allowedHeaders: '*',
    //     origin: ['https://isti-bazar.vercel.app', 'http://localhost:3000'],
    // });

    const whitelist = ['http://localhost:3000', 'https://isti-bazar.vercel.app'];
    app.enableCors({
        origin: function (origin, callback) {
            if (!origin || whitelist.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
    });

    await app.listen(process.env.PORT || 5000);
}
bootstrap();
