import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    // app.enableCors({ origin: ['http://localhost:3000', 'https://isti-bazar.vercel.app'] });
    // app.enableCors({ origin: 'http://localhost:3000' });
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'https://isti-bazar.vercel.app',
            '*',
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        // credentials: true,
    });
    await app.listen(process.env.PORT || 5000);
}
bootstrap();
