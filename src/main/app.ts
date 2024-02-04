import { Application } from '@ubio/framework';
import { MongoDb } from '@ubio/framework/modules/mongodb';
import { dep } from 'mesh-ioc';

import { TaskRepository } from './repositories/TaskRepository.js';
import { MongoTaskRepository } from './repositories/TaskRepository.mongo.js';
import { StatusRouter } from './routes/StatusRouter.js';
import { TaskRouter } from './routes/TaskRouter.js';
import { TaskService } from './services/TaskService.js';

export class App extends Application {
    @dep() private mongodb!: MongoDb;

    override createGlobalScope() {
        const mesh = super.createGlobalScope();
        mesh.service(MongoDb);
        mesh.service(TaskRepository, MongoTaskRepository);
        mesh.service(TaskService);
        return mesh;
    }

    override createHttpRequestScope() {
        const mesh = super.createHttpRequestScope();
        mesh.service(StatusRouter);
        mesh.service(TaskRouter);
        return mesh;
    }

    override async beforeStart() {
        await this.mongodb.start();
        await this.httpServer.startServer();
    }

    override async afterStop() {
        await this.httpServer.stopServer();
        await this.mongodb.stop();
    }
}
