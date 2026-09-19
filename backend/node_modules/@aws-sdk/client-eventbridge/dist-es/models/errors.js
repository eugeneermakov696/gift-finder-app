import { EventBridgeServiceException as __BaseException } from "./EventBridgeServiceException";
export class AccessDeniedException extends __BaseException {
    name = "AccessDeniedException";
    $fault = "client";
    constructor(opts) {
        super({
            name: "AccessDeniedException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, AccessDeniedException.prototype);
    }
}
export class ConcurrentModificationException extends __BaseException {
    name = "ConcurrentModificationException";
    $fault = "client";
    constructor(opts) {
        super({
            name: "ConcurrentModificationException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, ConcurrentModificationException.prototype);
    }
}
export class InternalException extends __BaseException {
    name = "InternalException";
    $fault = "server";
    constructor(opts) {
        super({
            name: "InternalException",
            $fault: "server",
            ...opts,
        });
        Object.setPrototypeOf(this, InternalException.prototype);
    }
}
export class InvalidStateException extends __BaseException {
    name = "InvalidStateException";
    $fault = "client";
    constructor(opts) {
        super({
            name: "InvalidStateException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, InvalidStateException.prototype);
    }
}
export class OperationDisabledException extends __BaseException {
    name = "OperationDisabledException";
    $fault = "client";
    constructor(opts) {
        super({
            name: "OperationDisabledException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, OperationDisabledException.prototype);
    }
}
export class ResourceNotFoundException extends __BaseException {
    name = "ResourceNotFoundException";
    $fault = "client";
    constructor(opts) {
        super({
            name: "ResourceNotFoundException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, ResourceNotFoundException.prototype);
    }
}
export class IllegalStatusException extends __BaseException {
    name = "IllegalStatusException";
    $fault = "client";
    constructor(opts) {
        super({
            name: "IllegalStatusException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, IllegalStatusException.prototype);
    }
}
export class LimitExceededException extends __BaseException {
    name = "LimitExceededException";
    $fault = "client";
    constructor(opts) {
        super({
            name: "LimitExceededException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, LimitExceededException.prototype);
    }
}
export class ResourceAlreadyExistsException extends __BaseException {
    name = "ResourceAlreadyExistsException";
    $fault = "client";
    constructor(opts) {
        super({
            name: "ResourceAlreadyExistsException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, ResourceAlreadyExistsException.prototype);
    }
}
export class InvalidEventPatternException extends __BaseException {
    name = "InvalidEventPatternException";
    $fault = "client";
    constructor(opts) {
        super({
            name: "InvalidEventPatternException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, InvalidEventPatternException.prototype);
    }
}
export class ThrottlingException extends __BaseException {
    name = "ThrottlingException";
    $fault = "client";
    constructor(opts) {
        super({
            name: "ThrottlingException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, ThrottlingException.prototype);
    }
}
export class ManagedRuleException extends __BaseException {
    name = "ManagedRuleException";
    $fault = "client";
    constructor(opts) {
        super({
            name: "ManagedRuleException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, ManagedRuleException.prototype);
    }
}
export class PolicyLengthExceededException extends __BaseException {
    name = "PolicyLengthExceededException";
    $fault = "client";
    constructor(opts) {
        super({
            name: "PolicyLengthExceededException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, PolicyLengthExceededException.prototype);
    }
}
