import { Task } from '../schema/TaskSchema.js';

export type TaskUpdateSpec = Partial<Omit<Task, 'id'>>;

export abstract class TaskRepository {
    abstract getTask(id: string): Promise<Task | null>;
    abstract getAllTasks(): Promise<Task[]>;
    abstract createTask(task: Task): Promise<void>;
    abstract updateTask(id: string, spec: TaskUpdateSpec): Promise<boolean>;
    abstract deleteTask(id: string, date: string): Promise<boolean>;
}
