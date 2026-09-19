import type { Paginator } from "@smithy/types";
import { ListUsersCommandInput, ListUsersCommandOutput } from "../commands/ListUsersCommand";
import type { IAMPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListUsers: (config: IAMPaginationConfiguration, input: ListUsersCommandInput, ...rest: any[]) => Paginator<ListUsersCommandOutput>;
