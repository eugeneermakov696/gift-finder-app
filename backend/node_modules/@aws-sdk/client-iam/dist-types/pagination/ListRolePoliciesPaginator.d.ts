import type { Paginator } from "@smithy/types";
import { ListRolePoliciesCommandInput, ListRolePoliciesCommandOutput } from "../commands/ListRolePoliciesCommand";
import type { IAMPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListRolePolicies: (config: IAMPaginationConfiguration, input: ListRolePoliciesCommandInput, ...rest: any[]) => Paginator<ListRolePoliciesCommandOutput>;
