export class NotFoundError extends Error {
    override name = this.constructor.name;
    status = 404;
}
