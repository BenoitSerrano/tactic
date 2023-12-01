import Express, { Response } from 'express';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import { config } from './config';
import { dataSource } from './dataSource';
import { router } from './router';

export { runApp };

async function runApp() {
    await dataSource.initialize();
    console.log(`Data source has been initialized`);

    const app = Express();

    app.use('/api', cors({ origin: config.CLIENT_URL }), bodyParser.json(), router);

    app.use(Express.static(path.join(__dirname, '..', '..', 'src', 'client', 'build')));

    app.get('/*', (_, res: Response) => {
        res.sendFile(path.join(__dirname, '..', '..', 'src', 'client', 'build', 'index.html'));
    });

    app.listen(config.PORT, async () => {
        console.log(`Server is running on port ${config.PORT}`);
    });
}
