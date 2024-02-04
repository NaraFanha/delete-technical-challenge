## Challenge: soft delete

#### Requirements:
- When deleting a task, perform a "soft delete" instead of an "hard delete"
- Deleted tasks should not show in the GET /tasks endpoint
- Deleted taks should still be accessible via GET /tasks/{taskId} endpoint

#### Approach

##### DELETE /tasks/{taskId} endpoint changes

My approach was adding a new field to the Task schema named `deletedAt`, that would be the date when the task was deleted.

    export type Task = {
        id: string;
        title: string;
        description?: string;
        isCompleted: boolean;
        deletedAt?: string;
    };

This way when a task is asked to be deleted the field will be filled with the current date.

###### Corner case:
*What should happen when the task asked to be deleted was already deleted?*
- My approach was understanding that **if a task was previous deleted** (has the deletedAt field filled) i**t should be considered deleted as if it does not exists**.
- When getting a task to be deleted we should only get the tasks that do not have the field deletedAt filled, and if we don't get a task to be deleted we should consider that the task does not exist.

###### Other possible solutions:
- Return an error if the task being deleted was already deleted
- Don't delete and log the action of a task being deleted was already deleted, return that the task was deleted, withouth updating the deletedAt field

##### GET /tasks endpoint changes
- Added a filter in the repository to now show the deleted tasks
