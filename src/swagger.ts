import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { SwaggerTheme } from 'swagger-themes';
import { ENUM_APP_ENVIRONMENT } from './app/constants/app.enum.constant';
import { environments } from './environments/environments';

export default async function (
    app: NestExpressApplication<
        Server<typeof IncomingMessage, typeof ServerResponse>
    >
) {
    const configService = environments.doc;
    const env: string = environments.development;
    const logger = new Logger();

    const docName: string = configService.name;
    const docDesc: string = configService.description;
    const docVersion: string = configService.version;
    const docPrefix: string = configService.prefix;

    if (env !== ENUM_APP_ENVIRONMENT.PRODUCTION) {
        const documentBuild = new DocumentBuilder()
            .setTitle(docName)
            .setDescription(docDesc)
            .setVersion(docVersion)
            .addBearerAuth(
                { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
                'accessToken'
            )
            .addBearerAuth(
                { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
                'refreshToken'
            )
            .build();

        const document = SwaggerModule.createDocument(app, documentBuild, {
            deepScanRoutes: true,
            extraModels: [],
        });

        const theme = new SwaggerTheme('v3');
        SwaggerModule.setup(docPrefix, app, document, {
            jsonDocumentUrl: `${docPrefix}/json`,
            yamlDocumentUrl: `${docPrefix}/yaml`,
            explorer: false,
            customSiteTitle: docName,
            customCss: theme.getBuffer('dark'),
            swaggerOptions: {
                showExtensions: true,
                docExpansion: 'none',
                persistAuthorization: true,
                displayOperationId: true,
                operationsSorter: 'alpha',
                tagsSorter: 'alpha',
                tryItOutEnabled: true,
                filter: true,
                deepLinking: true,
                syntaxHighlight: {
                    activate: true,
                    theme: 'tomorrow-night',
                },
            },
        });
    }
}
