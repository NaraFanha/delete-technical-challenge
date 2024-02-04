#!/usr/bin/env node
import 'reflect-metadata';

import dotenv from 'dotenv';

import { App } from '../main/app.js';

dotenv.config();

const app = new App();

try {
    await app.start();
} catch (error: any) {
    app.logger.error('Failed to start', { error });
    process.exit(1);
}
