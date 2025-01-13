import express from 'express';
import cors from 'cors';
import MongoSingleton from './config/mongoDB.config.js';
import { addLogger, appLogger } from './config/loggers.config.js';
import { __dirname } from './path.js';
import indexRouter from './routes/index.routes.js';

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.use(addLogger);

app.use(indexRouter)

async function connectMongo() {
    appLogger.info('Connecting to MongoDB...');
    try {
        await MongoSingleton.getInstance()
    } catch (error) {
        appLogger.error('MongoDB connection error: ', error);
        process.exit(1);
    }
}

let port = 8080;

app.listen(port, () => {
    appLogger.info(`Server running on port ${port}`);
    connectMongo();
});