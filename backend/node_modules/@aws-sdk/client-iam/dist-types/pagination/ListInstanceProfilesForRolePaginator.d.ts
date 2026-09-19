import type { Paginator } from "@smithy/types";
import { ListInstanceProfilesForRoleCommandInput, ListInstanceProfilesForRoleCommandOutput } from "../commands/ListInstanceProfilesForRoleCommand";
import type { IAMPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListInstanceProfilesForRole: (config: IAMPaginationConfiguration, input: ListInstanceProfilesForRoleCommandInput, ...rest: any[]) => Paginator<ListInstanceProfilesForRoleCommandOutput>;
