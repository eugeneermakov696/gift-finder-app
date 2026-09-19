import type { Paginator } from "@smithy/types";
import { ListAttachedUserPoliciesCommandInput, ListAttachedUserPoliciesCommandOutput } from "../commands/ListAttachedUserPoliciesCommand";
import type { IAMPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListAttachedUserPolicies: (config: IAMPaginationConfiguration, input: ListAttachedUserPoliciesCommandInput, ...rest: any[]) => Paginator<ListAttachedUserPoliciesCommandOutput>;
