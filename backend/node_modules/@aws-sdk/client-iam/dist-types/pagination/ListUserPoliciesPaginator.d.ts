import type { Paginator } from "@smithy/types";
import { ListUserPoliciesCommandInput, ListUserPoliciesCommandOutput } from "../commands/ListUserPoliciesCommand";
import type { IAMPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListUserPolicies: (config: IAMPaginationConfiguration, input: ListUserPoliciesCommandInput, ...rest: any[]) => Paginator<ListUserPoliciesCommandOutput>;
