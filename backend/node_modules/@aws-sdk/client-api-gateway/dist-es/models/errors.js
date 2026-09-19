import { APIGatewayServiceException as __BaseException } from "./APIGatewayServiceException";
export class BadRequestException extends __BaseException {
    name = "BadRequestException";
    $fault = "client";
    constructor(opts) {
        super({
            name: "BadRequestException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, BadRequestException.prototype);
    }
}
export class ConflictException extends __BaseException {
    name = "ConflictException";
    $fault = "client";
    constructor(opts) {
        super({
            name: "ConflictException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, ConflictException.prototype);
    }
}
export class LimitExceededException extends __BaseException {
    name = "LimitExceededException";
    $fault = "client";
    retryAfterSeconds;
    constructor(opts) {
        super({
            name: "LimitExceededException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, LimitExceededException.prototype);
        this.retryAfterSeconds = opts.retryAfterSeconds;
    }
}
export class NotFoundException extends __BaseException {
    name = "NotFoundException";
    $fault = "client";
    constructor(opts) {
        super({
            name: "NotFoundException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, NotFoundException.prototype);
    }
}
export class TooManyRequestsException extends __BaseException {
    name = "TooManyRequestsException";
    $fault = "client";
    retryAfterSeconds;
    constructor(opts) {
        super({
            name: "TooManyRequestsException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, TooManyRequestsException.prototype);
        this.retryAfterSeconds = opts.retryAfterSeconds;
    }
}
export class UnauthorizedException extends __BaseException {
    name = "UnauthorizedException";
    $fault = "client";
    constructor(opts) {
        super({
            name: "UnauthorizedException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, UnauthorizedException.prototype);
    }
}
export class ServiceUnavailableException extends __BaseException {
    name = "ServiceUnavailableException";
    $fault = "server";
    retryAfterSeconds;
    constructor(opts) {
        super({
            name: "ServiceUnavailableException",
            $fault: "server",
            ...opts,
        });
        Object.setPrototypeOf(this, ServiceUnavailableException.prototype);
        this.retryAfterSeconds = opts.retryAfterSeconds;
    }
}
