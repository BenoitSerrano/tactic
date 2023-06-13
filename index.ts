import Express, { Response } from 'express';
import 'reflect-metadata';
import cors from 'cors';
import path from 'path';
import { config } from './src/config';
import { dataSource } from './src/dataSource';

runApp();

async function runApp() {
    const app = Express();

    app.use(cors());

    app.use(Express.static(path.join(__dirname, '..', 'src', 'client', 'build')));

    app.get('/*', (_, res: Response) => {
        res.sendFile(path.join(__dirname, '..', 'src', 'client', 'build', 'index.html'));
    });

    await dataSource.initialize();

    app.listen(config.PORT, async () => {
        console.log(`Server is running on port ${config.PORT}`);
    });
}
