import express from 'express';
import session from 'express-session';
import cors from 'cors';
import MongoSingleton from './config/mongoDB.config.js';
import { addLogger, appLogger } from './config/loggers.config.js';
import { __dirname } from './path.js';
import indexRouter from './routes/index.routes.js';
import dotenv from 'dotenv';
import MongoStore from "connect-mongo";

const app = express();

dotenv.config();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.DBURL
    }),
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

let PORT = process.env.PORT || 3000;

console.log(PORT);


app.listen(PORT, () => {
    appLogger.http(`Servidor iniciado en PUERTO: ${PORT}`);
    connectMongo()
});