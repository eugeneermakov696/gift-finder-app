import type { Paginator } from "@smithy/types";
import { ListAttachedRolePoliciesCommandInput, ListAttachedRolePoliciesCommandOutput } from "../commands/ListAttachedRolePoliciesCommand";
import type { IAMPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListAttachedRolePolicies: (config: IAMPaginationConfiguration, input: ListAttachedRolePoliciesCommandInput, ...rest: any[]) => Paginator<ListAttachedRolePoliciesCommandOutput>;
