Hi there! 👋

We are excited about you considering to join our small team of dedicated engineers.

This repo contains a small HTTP-based microservice built using [Node Framework](https://github.com/ubio/node-framework) (our framework for building back-end applications). We at [Ubio](https://ub.io) use this repo as a basis for technical challenges for software engineering positions.

The remaining of README describes the service itself. Please proceed to [Challenges](CHALLENGES.md) for the assignments and our expectations.

# Task Service

This application is a simple task manager. It allows clients to create, find, list, complete and delete tasks. It is developed using our default code structure and design practices.

## Endpoints

### GET /tasks/{taskId}

Finds and returns a task by specified `taskId`. If the task is not found, returns a 404 error.

```
GET /tasks/{taskId}

{
    "id": "123",
    "title": "Write some code",
    "isCompleted": true,
}
```

### GET /tasks

Returns a list of all tasks.

```
GET /tasks

[
    {
        "id": "123",
        "title": "Write some code",
        "isCompleted": true,
    }
]
```

### POST /tasks

Creates a new task and returns its id.

```
POST /tasks { "title": "Write some code", "isCompleted": false }

"123"
```

### PUT /tasks/{taskId}/complete

Marks the task with the specified `taskId` as completed.
Returns no content if successful.
If the task is not found, returns a 404 error.

```
PUT /tasks/123/complete

<no content>
```

### DELETE /tasks/{taskId}

Deletes the task with specified `taskId`.
Returns no content if successful.
If the task is not found, returns a 404 error.

```
DELETE /tasks/123

<no content>
```
