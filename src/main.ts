import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';
import { ExceptionsFilter } from './core/filter/exceptions.filter';
import { environments } from './environments/environments';
import { LoggingInterceptor } from './shared/interception/logging.interceptor';
import { TransformInterceptor } from './shared/interception/transform.interceptor';
import swaggerInit from './swagger';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.useGlobalInterceptors(
        new LoggingInterceptor(),
        new TransformInterceptor()
    );

    app.useGlobalFilters(new ExceptionsFilter());
    app.useGlobalPipes(
        new ValidationPipe({ transform: true, whitelist: false })
    );

    app.enableCors({
        origin: '*',
        credentials: true,
    });
    app.enableShutdownHooks();

    const PORT = environments.port;
    const logger = new Logger('NestApplication');

    await swaggerInit(app);

    await app.listen(PORT, () => {
        logger.log(`Server initialized on port ${PORT}`);
    });
}
bootstrap();
