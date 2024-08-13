import Express, { Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import { config } from './config';
import { dataSource } from './dataSource';
import { router } from './router';
import { logger } from './lib/logger';

export { runApp };

async function runApp() {
    await dataSource.initialize();
    logger.info(`Data source has been initialized`);

    const app = Express();

    app.use('/api', cors({ origin: config.CLIENT_URL }), bodyParser.json(), router);

    app.use(Express.static(path.join(__dirname, '..', '..', 'src', 'client', 'build')));

    app.get(
        '/*',
        helmet({ contentSecurityPolicy: { directives: specificCspDirectives } }),
        (_, res: Response) => {
            res.sendFile(path.join(__dirname, '..', '..', 'src', 'client', 'build', 'index.html'));
        },
    );

    app.listen(config.PORT, async () => {
        logger.info(`Server is running on port ${config.PORT}`);
    });
}

const specificCspDirectives = {
    'img-src': [
        "'self'",
        'data:',
        'tactic-app.fr',
        'files.portive.com',
        'client.crisp.chat',
        'image.crisp.chat',
        'storage.crisp.chat',
    ],
    'font-src': ["'self'", 'client.crisp.chat'],
    'media-src': ["'self'", 'client.crisp.chat'],
    'style-src': [
        "'self'",
        'client.crisp.chat',
        "'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='",
        "'sha256-qGZj8fy4Etp9XlooL/Ilz+mx0y4V+Uu+F7tY38W+15g='",
        "'sha256-MKASWYfd3dGFQes9nQT5XnslE3xYlnUb4cHpxhk4fag='",
    ],
    'frame-src': ["'self'", 'game.crisp.chat'],
    'script-src': [
        "'self'",
        'settings.crisp.chat',
        "'sha256-RtdC0WqE+hX0MgZZk4QgMbkV1woYKbsuKQKKnWxsudI='",
    ],
    'script-src-elem': [
        "'self'",
        'client.crisp.chat',
        "'sha256-RtdC0WqE+hX0MgZZk4QgMbkV1woYKbsuKQKKnWxsudI='",
    ],
    'connect-src': [
        "'self'",
        'wss://client.relay.crisp.chat',
        'client.crisp.chat',
        'storage.crisp.chat',
        'wss://stream.relay.crisp.chat',
    ],
};
