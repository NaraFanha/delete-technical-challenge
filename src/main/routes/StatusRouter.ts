import { Get, Router } from '@ubio/framework';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

export class StatusRouter extends Router {
    @Get({
        path: '/status',
    })
    async status(): Promise<{ version: string }> {
        return {
            version: pkg.version,
        };
    }
}
