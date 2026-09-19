export const ApiDestinationState = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
};
export const ApiDestinationHttpMethod = {
    DELETE: "DELETE",
    GET: "GET",
    HEAD: "HEAD",
    OPTIONS: "OPTIONS",
    PATCH: "PATCH",
    POST: "POST",
    PUT: "PUT",
};
export const ArchiveState = {
    CREATE_FAILED: "CREATE_FAILED",
    CREATING: "CREATING",
    DISABLED: "DISABLED",
    ENABLED: "ENABLED",
    UPDATE_FAILED: "UPDATE_FAILED",
    UPDATING: "UPDATING",
};
export const AssignPublicIp = {
    DISABLED: "DISABLED",
    ENABLED: "ENABLED",
};
export const ReplayState = {
    CANCELLED: "CANCELLED",
    CANCELLING: "CANCELLING",
    COMPLETED: "COMPLETED",
    FAILED: "FAILED",
    RUNNING: "RUNNING",
    STARTING: "STARTING",
};
export const ConnectionAuthorizationType = {
    API_KEY: "API_KEY",
    BASIC: "BASIC",
    OAUTH_CLIENT_CREDENTIALS: "OAUTH_CLIENT_CREDENTIALS",
};
export const ConnectionOAuthHttpMethod = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
};
export const ConnectionState = {
    ACTIVE: "ACTIVE",
    AUTHORIZED: "AUTHORIZED",
    AUTHORIZING: "AUTHORIZING",
    CREATING: "CREATING",
    DEAUTHORIZED: "DEAUTHORIZED",
    DEAUTHORIZING: "DEAUTHORIZING",
    DELETING: "DELETING",
    FAILED_CONNECTIVITY: "FAILED_CONNECTIVITY",
    UPDATING: "UPDATING",
};
export const ReplicationState = {
    DISABLED: "DISABLED",
    ENABLED: "ENABLED",
};
export const EndpointState = {
    ACTIVE: "ACTIVE",
    CREATE_FAILED: "CREATE_FAILED",
    CREATING: "CREATING",
    DELETE_FAILED: "DELETE_FAILED",
    DELETING: "DELETING",
    UPDATE_FAILED: "UPDATE_FAILED",
    UPDATING: "UPDATING",
};
export const IncludeDetail = {
    FULL: "FULL",
    NONE: "NONE",
};
export const Level = {
    ERROR: "ERROR",
    INFO: "INFO",
    OFF: "OFF",
    TRACE: "TRACE",
};
export const EventSourceState = {
    ACTIVE: "ACTIVE",
    DELETED: "DELETED",
    PENDING: "PENDING",
};
export const RuleState = {
    DISABLED: "DISABLED",
    ENABLED: "ENABLED",
    ENABLED_WITH_ALL_CLOUDTRAIL_MANAGEMENT_EVENTS: "ENABLED_WITH_ALL_CLOUDTRAIL_MANAGEMENT_EVENTS",
};
export const LaunchType = {
    EC2: "EC2",
    EXTERNAL: "EXTERNAL",
    FARGATE: "FARGATE",
};
export const PlacementConstraintType = {
    DISTINCT_INSTANCE: "distinctInstance",
    MEMBER_OF: "memberOf",
};
export const PlacementStrategyType = {
    BINPACK: "binpack",
    RANDOM: "random",
    SPREAD: "spread",
};
export const PropagateTags = {
    TASK_DEFINITION: "TASK_DEFINITION",
};
