import { ClientError } from '@ubio/framework';
import { dep } from 'mesh-ioc';

import { MongoDb } from '../mongodb.js';
import { Task, TaskSchema } from '../schema/TaskSchema.js';
import { TaskRepository, TaskUpdateSpec } from './TaskRepository.js';

interface MongoTask {
    _id: string;
    title: string;
    description?: string;
    isCompleted: boolean;
    deletedAt?: string;
}

export class MongoTaskRepository extends TaskRepository {
    @dep() private mongodb!: MongoDb;

    async setup() {
        // TODO add indexes
    }

    private get collection() {
        return this.mongodb.db.collection<MongoTask>('tasks');
    }

    async getTask(id: string): Promise<Task | null> {
        const doc = await this.collection.findOne({ _id: id });
        return doc ? this.deserialize(doc) : null;
    }

    async getAllTasks(): Promise<Task[]> {
        const docs = await this.collection.find({ deletedAt: { $exists: false } }).toArray();
        return docs.map(doc => this.deserialize(doc));
    }

    async createTask(task: Task) {
        try {
            await this.collection.insertOne({
                _id: task.id,
                title: task.title,
                description: task.description,
                isCompleted: task.isCompleted,
                deletedAt: task.deletedAt,
            });
        } catch (error) {
            // 11000 is a code for duplicate key error
            if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
                throw new ClientError(`Task with id ${task.id} already exists`);
            }
            throw error;
        }
    }

    async updateTask(id: string, spec: TaskUpdateSpec) {
        const res = await this.collection.updateOne(
            {
                _id: id,
            },
            {
                $set: {
                    ...spec,
                },
            }
        );
        return res.matchedCount > 0;
    }

    async deleteTask(id: string, date: string) {
        const res = await this.collection.updateOne(
            {
                _id: id,
                deletedAt: { $exists: false },
            },
            {
                $set: {
                    deletedAt: date,
                },
            }
        );
        return res.matchedCount > 0;
    }

    private deserialize(doc: MongoTask): Task {
        return TaskSchema.decode({
            ...doc,
            id: doc._id,
        });
    }
}
