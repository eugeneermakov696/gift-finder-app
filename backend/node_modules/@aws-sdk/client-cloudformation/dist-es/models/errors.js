import { CloudFormationServiceException as __BaseException } from "./CloudFormationServiceException";
export class InvalidOperationException extends __BaseException {
    name = "InvalidOperationException";
    $fault = "client";
    Message;
    constructor(opts) {
        super({
            name: "InvalidOperationException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, InvalidOperationException.prototype);
        this.Message = opts.Message;
    }
}
export class OperationNotFoundException extends __BaseException {
    name = "OperationNotFoundException";
    $fault = "client";
    Message;
    constructor(opts) {
        super({
            name: "OperationNotFoundException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, OperationNotFoundException.prototype);
        this.Message = opts.Message;
    }
}
export class CFNRegistryException extends __BaseException {
    name = "CFNRegistryException";
    $fault = "client";
    Message;
    constructor(opts) {
        super({
            name: "CFNRegistryException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, CFNRegistryException.prototype);
        this.Message = opts.Message;
    }
}
export class TypeNotFoundException extends __BaseException {
    name = "TypeNotFoundException";
    $fault = "client";
    Message;
    constructor(opts) {
        super({
            name: "TypeNotFoundException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, TypeNotFoundException.prototype);
        this.Message = opts.Message;
    }
}
export class AlreadyExistsException extends __BaseException {
    name = "AlreadyExistsException";
    $fault = "client";
    Message;
    constructor(opts) {
        super({
            name: "AlreadyExistsException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, AlreadyExistsException.prototype);
        this.Message = opts.Message;
    }
}
export class TypeConfigurationNotFoundException extends __BaseException {
    name = "TypeConfigurationNotFoundException";
    $fault = "client";
    Message;
    constructor(opts) {
        super({
            name: "TypeConfigurationNotFoundException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, TypeConfigurationNotFoundException.prototype);
        this.Message = opts.Message;
    }
}
export class TokenAlreadyExistsException extends __BaseException {
    name = "TokenAlreadyExistsException";
    $fault = "client";
    Message;
    constructor(opts) {
        super({
            name: "TokenAlreadyExistsException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, TokenAlreadyExistsException.prototype);
        this.Message = opts.Message;
    }
}
export class ChangeSetNotFoundException extends __BaseException {
    name = "ChangeSetNotFoundException";
    $fault = "client";
    Message;
    constructor(opts) {
        super({
            name: "ChangeSetNotFoundException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, ChangeSetNotFoundException.prototype);
        this.Message = opts.Message;
    }
}
export class InsufficientCapabilitiesException extends __BaseException {
    name = "InsufficientCapabilitiesException";
    $fault = "client";
    Message;
    constructor(opts) {
        super({
            name: "InsufficientCapabilitiesException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, InsufficientCapabilitiesException.prototype);
        this.Message = opts.Message;
    }
}
export class LimitExceededException extends __BaseException {
    name = "LimitExceededException";
    $fault = "client";
    Message;
    constructor(opts) {
        super({
            name: "LimitExceededException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, LimitExceededException.prototype);
        this.Message = opts.Message;
    }
}
export class ConcurrentResourcesLimitExceededException extends __BaseException {
    name = "ConcurrentResourcesLimitExceededException";
    $fault = "client";
    Message;
    constructor(opts) {
        super({
            name: "ConcurrentResourcesLimitExceededException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, ConcurrentResourcesLimitExceededException.prototype);
        this.Message = opts.Message;
    }
}
export class OperationIdAlreadyExistsException extends __BaseException {
    name = "OperationIdAlreadyExistsException";
    $fault = "client";
    Message;
    constructor(opts) {
        super({
            name: "OperationIdAlreadyExistsException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, OperationIdAlreadyExistsException.prototype);
        this.Message = opts.Message;
    }
}
export class OperationInProgressException extends __BaseException {
    name = "OperationInProgressException";
    $fault = "client";
    Message;
    constructor(opts) {
        super({
            name: "OperationInProgressException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, OperationInProgressException.prototype);
        this.Message = opts.Message;
    }
}
export class StackSetNotFoundException extends __BaseException {
    name = "StackSetNotFoundException";
    $fault = "client";
    Message;
    constructor(opts) {
        super({
            name: "StackSetNotFoundException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, StackSetNotFoundException.prototype);
        this.Message = opts.Message;
    }
}
export class StaleRequestException extends __BaseException {
    name = "StaleRequestException";
    $fault = "client";
    Message;
    constructor(opts) {
        super({
            name: "StaleRequestException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, StaleRequestException.prototype);
        this.Message = opts.Message;
    }
}
export class CreatedButModifiedException extends __BaseException {
    name = "CreatedButModifiedException";
    $fault = "client";
    Message;
    constructor(opts) {
        super({
            name: "CreatedButModifiedException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, CreatedButModifiedException.prototype);
        this.Message = opts.Message;
    }
}
export class NameAlreadyExistsException extends __BaseException {
    name = "NameAlreadyExistsException";
    $fault = "client";
    Message;
    constructor(opts) {
        super({
            name: "NameAlreadyExistsException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, NameAlreadyExistsException.prototype);
        this.Message = opts.Message;
    }
}
export class InvalidChangeSetStatusException extends __BaseException {
    name = "InvalidChangeSetStatusException";
    $fault = "client";
    Message;
    constructor(opts) {
        super({
            name: "InvalidChangeSetStatusException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, InvalidChangeSetStatusException.prototype);
        this.Message = opts.Message;
    }
}
export class GeneratedTemplateNotFoundException extends __BaseException {
    name = "GeneratedTemplateNotFoundException";
    $fault = "client";
    Message;
    constructor(opts) {
        super({
            name: "GeneratedTemplateNotFoundException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, GeneratedTemplateNotFoundException.prototype);
        this.Message = opts.Message;
    }
}
export class StackSetNotEmptyException extends __BaseException {
    name = "StackSetNotEmptyException";
    $fault = "client";
    Message;
    constructor(opts) {
        super({
            name: "StackSetNotEmptyException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, StackSetNotEmptyException.prototype);
        this.Message = opts.Message;
    }
}
export class ResourceScanNotFoundException extends __BaseException {
    name = "ResourceScanNotFoundException";
    $fault = "client";
    Message;
    constructor(opts) {
        super({
            name: "ResourceScanNotFoundException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, ResourceScanNotFoundException.prototype);
        this.Message = opts.Message;
    }
}
export class StackInstanceNotFoundException extends __BaseException {
    name = "StackInstanceNotFoundException";
    $fault = "client";
    Message;
    constructor(opts) {
        super({
            name: "StackInstanceNotFoundException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, StackInstanceNotFoundException.prototype);
        this.Message = opts.Message;
    }
}
export class StackRefactorNotFoundException extends __BaseException {
    name = "StackRefactorNotFoundException";
    $fault = "client";
    Message;
    constructor(opts) {
        super({
            name: "StackRefactorNotFoundException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, StackRefactorNotFoundException.prototype);
        this.Message = opts.Message;
    }
}
export class HookResultNotFoundException extends __BaseException {
    name = "HookResultNotFoundException";
    $fault = "client";
    Message;
    constructor(opts) {
        super({
            name: "HookResultNotFoundException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, HookResultNotFoundException.prototype);
        this.Message = opts.Message;
    }
}
export class StackNotFoundException extends __BaseException {
    name = "StackNotFoundException";
    $fault = "client";
    Message;
    constructor(opts) {
        super({
            name: "StackNotFoundException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, StackNotFoundException.prototype);
        this.Message = opts.Message;
    }
}
export class ResourceScanInProgressException extends __BaseException {
    name = "ResourceScanInProgressException";
    $fault = "client";
    Message;
    constructor(opts) {
        super({
            name: "ResourceScanInProgressException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, ResourceScanInProgressException.prototype);
        this.Message = opts.Message;
    }
}
export class InvalidStateTransitionException extends __BaseException {
    name = "InvalidStateTransitionException";
    $fault = "client";
    Message;
    constructor(opts) {
        super({
            name: "InvalidStateTransitionException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, InvalidStateTransitionException.prototype);
        this.Message = opts.Message;
    }
}
export class OperationStatusCheckFailedException extends __BaseException {
    name = "OperationStatusCheckFailedException";
    $fault = "client";
    Message;
    constructor(opts) {
        super({
            name: "OperationStatusCheckFailedException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, OperationStatusCheckFailedException.prototype);
        this.Message = opts.Message;
    }
}
export class ResourceScanLimitExceededException extends __BaseException {
    name = "ResourceScanLimitExceededException";
    $fault = "client";
    Message;
    constructor(opts) {
        super({
            name: "ResourceScanLimitExceededException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, ResourceScanLimitExceededException.prototype);
        this.Message = opts.Message;
    }
}
