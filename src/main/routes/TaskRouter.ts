import { BodyParam, Delete, Get, PathParam, Post, Put, Router } from '@ubio/framework';
import { dep } from 'mesh-ioc';

import { TaskService } from '../services/TaskService.js';

export class TaskRouter extends Router {
    @dep() private taskService!: TaskService;

    @Get({ path: '/tasks/{taskId}' })
    async getTask(
        @PathParam('taskId', { schema: { type: 'string' }, required: true })
        taskId: string
    ) {
        return await this.taskService.getById(taskId);
    }

    @Get({ path: '/tasks' })
    async getTasks() {
        return await this.taskService.getAll();
    }

    @Post({ path: '/tasks' })
    async createTask(
        @BodyParam('title', { schema: { type: 'string' }, required: true })
        title: string,
        @BodyParam('description', { schema: { type: 'string' }, required: false })
        description?: string
    ) {
        const taskId = await this.taskService.create(title, description);
        this.ctx.status = 201;
        return taskId;
    }

    @Put({ path: '/tasks/{taskId}/complete' })
    async completeTask(
        @PathParam('taskId', { schema: { type: 'string' }, required: true })
        taskId: string
    ) {
        await this.taskService.markComplete(taskId);
    }

    @Delete({ path: '/tasks/{taskId}' })
    async deleteTask(
        @PathParam('taskId', { schema: { type: 'string' }, required: true })
        taskId: string
    ) {
        await this.taskService.delete(taskId);
    }
}
