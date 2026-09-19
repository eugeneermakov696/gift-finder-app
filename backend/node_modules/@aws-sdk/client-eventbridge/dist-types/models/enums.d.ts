/**
 * @public
 * @enum
 */
export declare const ApiDestinationState: {
    readonly ACTIVE: "ACTIVE";
    readonly INACTIVE: "INACTIVE";
};
/**
 * @public
 */
export type ApiDestinationState = (typeof ApiDestinationState)[keyof typeof ApiDestinationState];
/**
 * @public
 * @enum
 */
export declare const ApiDestinationHttpMethod: {
    readonly DELETE: "DELETE";
    readonly GET: "GET";
    readonly HEAD: "HEAD";
    readonly OPTIONS: "OPTIONS";
    readonly PATCH: "PATCH";
    readonly POST: "POST";
    readonly PUT: "PUT";
};
/**
 * @public
 */
export type ApiDestinationHttpMethod = (typeof ApiDestinationHttpMethod)[keyof typeof ApiDestinationHttpMethod];
/**
 * @public
 * @enum
 */
export declare const ArchiveState: {
    readonly CREATE_FAILED: "CREATE_FAILED";
    readonly CREATING: "CREATING";
    readonly DISABLED: "DISABLED";
    readonly ENABLED: "ENABLED";
    readonly UPDATE_FAILED: "UPDATE_FAILED";
    readonly UPDATING: "UPDATING";
};
/**
 * @public
 */
export type ArchiveState = (typeof ArchiveState)[keyof typeof ArchiveState];
/**
 * @public
 * @enum
 */
export declare const AssignPublicIp: {
    readonly DISABLED: "DISABLED";
    readonly ENABLED: "ENABLED";
};
/**
 * @public
 */
export type AssignPublicIp = (typeof AssignPublicIp)[keyof typeof AssignPublicIp];
/**
 * @public
 * @enum
 */
export declare const ReplayState: {
    readonly CANCELLED: "CANCELLED";
    readonly CANCELLING: "CANCELLING";
    readonly COMPLETED: "COMPLETED";
    readonly FAILED: "FAILED";
    readonly RUNNING: "RUNNING";
    readonly STARTING: "STARTING";
};
/**
 * @public
 */
export type ReplayState = (typeof ReplayState)[keyof typeof ReplayState];
/**
 * @public
 * @enum
 */
export declare const ConnectionAuthorizationType: {
    readonly API_KEY: "API_KEY";
    readonly BASIC: "BASIC";
    readonly OAUTH_CLIENT_CREDENTIALS: "OAUTH_CLIENT_CREDENTIALS";
};
/**
 * @public
 */
export type ConnectionAuthorizationType = (typeof ConnectionAuthorizationType)[keyof typeof ConnectionAuthorizationType];
/**
 * @public
 * @enum
 */
export declare const ConnectionOAuthHttpMethod: {
    readonly GET: "GET";
    readonly POST: "POST";
    readonly PUT: "PUT";
};
/**
 * @public
 */
export type ConnectionOAuthHttpMethod = (typeof ConnectionOAuthHttpMethod)[keyof typeof ConnectionOAuthHttpMethod];
/**
 * @public
 * @enum
 */
export declare const ConnectionState: {
    readonly ACTIVE: "ACTIVE";
    readonly AUTHORIZED: "AUTHORIZED";
    readonly AUTHORIZING: "AUTHORIZING";
    readonly CREATING: "CREATING";
    readonly DEAUTHORIZED: "DEAUTHORIZED";
    readonly DEAUTHORIZING: "DEAUTHORIZING";
    readonly DELETING: "DELETING";
    readonly FAILED_CONNECTIVITY: "FAILED_CONNECTIVITY";
    readonly UPDATING: "UPDATING";
};
/**
 * @public
 */
export type ConnectionState = (typeof ConnectionState)[keyof typeof ConnectionState];
/**
 * @public
 * @enum
 */
export declare const ReplicationState: {
    readonly DISABLED: "DISABLED";
    readonly ENABLED: "ENABLED";
};
/**
 * @public
 */
export type ReplicationState = (typeof ReplicationState)[keyof typeof ReplicationState];
/**
 * @public
 * @enum
 */
export declare const EndpointState: {
    readonly ACTIVE: "ACTIVE";
    readonly CREATE_FAILED: "CREATE_FAILED";
    readonly CREATING: "CREATING";
    readonly DELETE_FAILED: "DELETE_FAILED";
    readonly DELETING: "DELETING";
    readonly UPDATE_FAILED: "UPDATE_FAILED";
    readonly UPDATING: "UPDATING";
};
/**
 * @public
 */
export type EndpointState = (typeof EndpointState)[keyof typeof EndpointState];
/**
 * @public
 * @enum
 */
export declare const IncludeDetail: {
    readonly FULL: "FULL";
    readonly NONE: "NONE";
};
/**
 * @public
 */
export type IncludeDetail = (typeof IncludeDetail)[keyof typeof IncludeDetail];
/**
 * @public
 * @enum
 */
export declare const Level: {
    readonly ERROR: "ERROR";
    readonly INFO: "INFO";
    readonly OFF: "OFF";
    readonly TRACE: "TRACE";
};
/**
 * @public
 */
export type Level = (typeof Level)[keyof typeof Level];
/**
 * @public
 * @enum
 */
export declare const EventSourceState: {
    readonly ACTIVE: "ACTIVE";
    readonly DELETED: "DELETED";
    readonly PENDING: "PENDING";
};
/**
 * @public
 */
export type EventSourceState = (typeof EventSourceState)[keyof typeof EventSourceState];
/**
 * @public
 * @enum
 */
export declare const RuleState: {
    readonly DISABLED: "DISABLED";
    readonly ENABLED: "ENABLED";
    readonly ENABLED_WITH_ALL_CLOUDTRAIL_MANAGEMENT_EVENTS: "ENABLED_WITH_ALL_CLOUDTRAIL_MANAGEMENT_EVENTS";
};
/**
 * @public
 */
export type RuleState = (typeof RuleState)[keyof typeof RuleState];
/**
 * @public
 * @enum
 */
export declare const LaunchType: {
    readonly EC2: "EC2";
    readonly EXTERNAL: "EXTERNAL";
    readonly FARGATE: "FARGATE";
};
/**
 * @public
 */
export type LaunchType = (typeof LaunchType)[keyof typeof LaunchType];
/**
 * @public
 * @enum
 */
export declare const PlacementConstraintType: {
    readonly DISTINCT_INSTANCE: "distinctInstance";
    readonly MEMBER_OF: "memberOf";
};
/**
 * @public
 */
export type PlacementConstraintType = (typeof PlacementConstraintType)[keyof typeof PlacementConstraintType];
/**
 * @public
 * @enum
 */
export declare const PlacementStrategyType: {
    readonly BINPACK: "binpack";
    readonly RANDOM: "random";
    readonly SPREAD: "spread";
};
/**
 * @public
 */
export type PlacementStrategyType = (typeof PlacementStrategyType)[keyof typeof PlacementStrategyType];
/**
 * @public
 * @enum
 */
export declare const PropagateTags: {
    readonly TASK_DEFINITION: "TASK_DEFINITION";
};
/**
 * @public
 */
export type PropagateTags = (typeof PropagateTags)[keyof typeof PropagateTags];
