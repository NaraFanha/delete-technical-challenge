import { Logger } from '@ubio/framework';
import { randomUUID } from 'crypto';
import { dep } from 'mesh-ioc';

import { NotFoundError } from '../errors.js';
import { TaskRepository } from '../repositories/TaskRepository.js';

export class TaskService {

    @dep() private taskRepository!: TaskRepository;
    @dep() private logger!: Logger;

    async getById(taskId: string) {
        const task = await this.taskRepository.getTask(taskId);
        if (!task) {
            throw new NotFoundError('Task not found');
        }
        this.logger.info(`Task fetched`, { taskId });
        return task;
    }

    async getAll() {
        return await this.taskRepository.getAllTasks();
    }

    async create(title: string, description?: string) {
        const task = {
            id: randomUUID().toString(),
            title,
            description,
            isCompleted: false,
        };
        await this.taskRepository.createTask(task);
        this.logger.info(`Task created`, { task });
        return task.id;
    }

    async markComplete(taskId: string) {
        const updated = await this.taskRepository.updateTask(taskId, { isCompleted: true });
        if (!updated) {
            throw new NotFoundError('Task not found');
        }
        this.logger.info(`Task completed`, { taskId });
    }

    async delete(taskId: string) {
        const currentDate = new Date().toISOString();
        const deleted = await this.taskRepository.deleteTask(taskId, currentDate);
        if (!deleted) {
            throw new NotFoundError('Task not found');
        }
        this.logger.info(`Task deleted`, { taskId });
    }

}
