import express from 'express';
import session from 'express-session';
import cors from 'cors';
import MongoSingleton from './config/mongoDB.config.js';
import { addLogger, appLogger } from './config/loggers.config.js';
import { __dirname } from './path.js';
import indexRouter from './routes/index.routes.js';
import dotenv from 'dotenv';
import connectMongo from 'connect-mongo';

const app = express();

dotenv.config();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

// Instanciar la clase MongoStore correctamente con 'new'
const MongoStoreInstance = new MongoStore({
  mongooseConnection: MongoSingleton.getInstance(),  
});

async function connectMongoDB() {
  appLogger.info('Connecting to MongoDB...');
  try {
    const mongooseConnection = await MongoSingleton.getInstance(); // Esperamos que la conexión esté lista
    app.use(
      session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStoreInstance,  // Usamos la instancia de MongoStore
        cookie: {
          httpOnly: true,
          secure: false,
          maxAge: 24 * 1000 * 60 * 60, // 24 horas
        },
      })
    );
    appLogger.info('MongoDB connected successfully');
  } catch (error) {
    appLogger.error('MongoDB connection error: ', error);
    process.exit(1);  // Detenemos la aplicación si no se conecta correctamente
  }
}

// Llamar a la función para conectar a MongoDB
connectMongoDB();

app.use(addLogger);

app.use(indexRouter);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  appLogger.info(`Server running on port ${port}`);
});
