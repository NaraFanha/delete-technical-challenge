import { config, Logger } from '@ubio/framework';
import { dep } from 'mesh-ioc';
import { Db, MongoClient } from 'mongodb';

export class MongoDb {

    @dep() private logger!: Logger;

    @config() MONGO_URL!: string;

    isRunning = false;
    client = new MongoClient(this.MONGO_URL, {
        ignoreUndefined: true,
    });

    get db(): Db {
        return this.client.db();
    }

    async start() {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        await this.client.connect();
        this.logger.info('Connected to MongoDB');
    }

    async stop() {
        try {
            await this.client.close();
            this.logger.info('MongoDB connection closed');
        } finally {
            this.isRunning = false;
        }
    }
}
