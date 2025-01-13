import { connect } from 'mongoose';
import { appLogger } from './loggers.config.js';

export default class MongoSingleton {
    static #instance;

    constructor() {
        this.#connectMongoDB();

    };
    static getInstance() {
        if (this.#instance) {
            appLogger.info('Returning existing MongoDB connection');
        } else {
            this.#instance = new MongoSingleton();
        }
        return this.#instance;
    };

    #connectMongoDB = async () => {
        try {
            await connect(
               'mongodb+srv://compuservice2025:Ys1l6dgfZk1SJErp@cluster0.p8lpo.mongodb.net/CompuService',
            )
            appLogger.info('Connected to MongoDB');
        } catch (err) {
            appLogger.error('Error connecting to MongoDB', err);
            process.exit();
        }
    };
}
