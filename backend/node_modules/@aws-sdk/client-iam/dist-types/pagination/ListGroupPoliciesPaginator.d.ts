import type { Paginator } from "@smithy/types";
import { ListGroupPoliciesCommandInput, ListGroupPoliciesCommandOutput } from "../commands/ListGroupPoliciesCommand";
import type { IAMPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListGroupPolicies: (config: IAMPaginationConfiguration, input: ListGroupPoliciesCommandInput, ...rest: any[]) => Paginator<ListGroupPoliciesCommandOutput>;
