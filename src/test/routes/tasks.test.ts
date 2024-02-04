import assert from 'assert';
import { randomUUID } from 'crypto';

import { runtime } from '../runtime.js';

describe('GET /tasks/{taskId}', () => {

    beforeEach(async () => {
        await runtime.taskRepository.createTask({
            id: '123',
            title: 'Write some code',
            isCompleted: true,
        });
    });

    it('returns task if it exists', async () => {
        const res = await runtime.fetch('/tasks/123');
        assert.strictEqual(res.status, 200);
        const body = await res.json();
        assert.strictEqual(body.id, '123');
        assert.strictEqual(body.title, 'Write some code');
        assert.strictEqual(body.isCompleted, true);
    });

    it('returns 404 if task does not exist', async () => {
        const res = await runtime.fetch('/tasks/345');
        assert.strictEqual(res.status, 404);
        const body = await res.json();
        assert.strictEqual(body.name, 'NotFoundError');
    });

});

describe('GET /tasks', () => {
    beforeEach(async () => {
        await runtime.taskRepository.createTask({
            id: '123',
            title: 'Write some code',
            isCompleted: true,
        });
        await runtime.taskRepository.createTask({
            id: '456',
            title: 'Another task',
            isCompleted: false,
        });
        await runtime.taskRepository.createTask({
            id: '789',
            title: 'Oh no another task',
            isCompleted: true,
            deletedAt: "2024-02-02T15:15:48.960Z"
        });
    });

    it('returns the list of all non deleted tasks', async () => {
        const res = await runtime.fetch('/tasks');
        assert.strictEqual(res.status, 200);
        const body = await res.json();
        const [task1, task2] = body;

        assert.strictEqual(task1.id, '123');
        assert.strictEqual(task1.title, 'Write some code');
        assert.strictEqual(task1.isCompleted, true);
    
        assert.strictEqual(task2.id, '456');
        assert.strictEqual(task2.title, 'Another task');
        assert.strictEqual(task2.isCompleted, false);
    
        assert.strictEqual(body.length, 2);
    });

});

describe('POST /tasks', () => {

    it('creates a new task', async () => {
        const taskData = {
            title: 'Write some code',
        };

        const res = await runtime.fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        });

        assert.strictEqual(res.status, 201);
    });
});

describe('PUT /tasks/{taskId}/complete', () => {

    beforeEach(async () => {
        await runtime.taskRepository.createTask({
            id: '123',
            title: 'Write some code',
            isCompleted: false,
        });
    });

    it('marks existing task as completed', async () => {
        const taskId = '123';

        const res = await runtime.fetch(`/tasks/${taskId}/complete`, {
        method: 'PUT',
        });

        assert.strictEqual(res.status, 200);

        // Optionally, you can check if the task is marked as completed in your database
        const updatedTask = await runtime.taskRepository.getTask(taskId);
        assert.strictEqual(updatedTask!.isCompleted, true);
    });

    it('returns 404 if task does not exist', async () => {
        const nonExistentTaskId = '456';

        const res = await runtime.fetch(`/tasks/${nonExistentTaskId}/complete`, {
        method: 'PUT',
        });

        assert.strictEqual(res.status, 404);
    });

});

describe('DELETE /tasks/{taskId}', () => {
    beforeEach(async () => {
        await runtime.taskRepository.createTask({
            id: '123',
            title: 'Write some code',
            isCompleted: false,
        });
        await runtime.taskRepository.createTask({
            id: '456',
            title: 'Another task',
            isCompleted: false,
            deletedAt: '2024-02-04T16:09:11.757Z'
        });
    });

    it('deletes a task', async () => {
        const taskId = '123';
    
        const res = await runtime.fetch(`/tasks/${taskId}`, {
          method: 'DELETE',
        });
    
        assert.strictEqual(res.status, 200);
    
        const deletedTask = await runtime.taskRepository.getTask(taskId);
        assert.strictEqual(deletedTask!.deletedAt !== undefined, true);
    });

    it('returns 404 if task does not exist', async() => {
        const nonExistentTaskId = '789';

        const res = await runtime.fetch(`/tasks/${nonExistentTaskId}`, {
        method: 'DELETE',
        });

        assert.strictEqual(res.status, 404);
    });

    it('returns 404 if task does was already deleted', async() => {
        const nonExistentTaskId = '456';

        const res = await runtime.fetch(`/tasks/${nonExistentTaskId}`, {
        method: 'DELETE',
        });

        assert.strictEqual(res.status, 404);
    });

});
