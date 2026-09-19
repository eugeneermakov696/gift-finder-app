import type { Paginator } from "@smithy/types";
import { ListRolesCommandInput, ListRolesCommandOutput } from "../commands/ListRolesCommand";
import type { IAMPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListRoles: (config: IAMPaginationConfiguration, input: ListRolesCommandInput, ...rest: any[]) => Paginator<ListRolesCommandOutput>;
