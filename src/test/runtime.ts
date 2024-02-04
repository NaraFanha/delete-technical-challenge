import { config } from 'dotenv';
import { dep } from 'mesh-ioc';

import { App } from '../main/app.js';
import { MongoDb } from '../main/mongodb.js';
import { TaskRepository } from '../main/repositories/TaskRepository.js';

config({ path: '.env' });
config({ path: '.env.test' });

export class TestRuntime {
    @dep({ cache: false }) mongodb!: MongoDb;
    @dep({ cache: false }) taskRepository!: TaskRepository;

    app = new App();

    async setup() {
        this.app = new App();
        this.app.mesh.connect(this);
        await this.dropDatabase();
        await this.app.start();
    }

    async teardown() {
        await this.app.stop();
    }

    async dropDatabase() {
        await this.mongodb.start();
        await this.mongodb.client.db().dropDatabase();
    }

    get baseUrl() {
        return `http://localhost:${process.env.PORT ?? '8080'}`;
    }

    async fetch(path: string, init?: RequestInit) {
        return fetch(`${this.baseUrl}${path}`, init);
    }
}

export const runtime = new TestRuntime();
