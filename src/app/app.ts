import Express, { Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import { config } from '../config';
import { dataSource } from '../dataSource';
import { router } from '../router';
import { logger } from '../lib/logger';
import { securityResponseHeaderHandler } from './middlewares/securityResponseHeaderHandler';

export { runApp };

async function runApp() {
    await dataSource.initialize();
    logger.info(`Data source has been initialized`);

    const app = Express();

    app.use('/api', cors({ origin: config.CLIENT_URL }), bodyParser.json(), router);
    app.use('/static', Express.static(path.join(__dirname, '..', '..', '..', 'public')));

    app.use(Express.static(path.join(__dirname, '..', '..', '..', 'src', 'client', 'build')));

    app.get('/*', securityResponseHeaderHandler, (_, res: Response) => {
        res.sendFile(path.join(__dirname, '..', '..', '..', 'src', 'client', 'build', 'index.html'));
    });

    app.listen(config.PORT, async () => {
        logger.info(`Server is running on port ${config.PORT}`);
    });
}
