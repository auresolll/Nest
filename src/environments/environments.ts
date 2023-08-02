import 'dotenv/config';

export const environments = {
    port: Number(process.env.PORT),
    development: process.env.DEVELOPMENT,
    proxyEnabled: process.env.PROXY_ENABLED,
    doc: {
        name: process.env.NAME_DOC,
        description: process.env.DESCRIPTION_DOC,
        version: process.env.VERSION_DOC,
        prefix: process.env.PREFIX_DOC,
    },
    mongoUri: process.env.MONGO_URI,
    sessionSecret: process.env.SESSION_SECRET,
    recoverCodeExpiration: Number(process.env.RECOVER_CODE_EXPIRATION),
    frontEndUrl: process.env.FRONTEND_URL,
    token: {
        accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRATION,
        refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION,

        accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
        refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    },
};
