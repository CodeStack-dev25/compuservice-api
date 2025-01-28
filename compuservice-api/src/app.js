import express from 'express';
import session from 'express-session';
import cors from 'cors';
import MongoSingleton from './config/mongoDB.config.js';
import { addLogger, appLogger } from './config/loggers.config.js';
import { __dirname } from './path.js';
import indexRouter from './routes/index.routes.js';
import dotenv from 'dotenv';

const app = express();

dotenv.config();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.use(
    session({
      secret: process.env.SECRET, 
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 1000 * 60 * 60,
      },
    })
  );

app.use(addLogger);

app.use(indexRouter);

async function connectMongo() {
    appLogger.info('Connecting to MongoDB...');
    try {
        await MongoSingleton.getInstance()
    } catch (error) {
        appLogger.error('MongoDB connection error: ', error);
        process.exit(1);
    }
}

let port = process.env.PORT || 8080;


app.listen(port, () => {
    // appLogger.info(`Server running on port ${port}`
      console.log(`Server running on port ${port}`);
    connectMongo();
});