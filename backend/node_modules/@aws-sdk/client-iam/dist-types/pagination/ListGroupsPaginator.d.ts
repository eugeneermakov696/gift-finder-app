import type { Paginator } from "@smithy/types";
import { ListGroupsCommandInput, ListGroupsCommandOutput } from "../commands/ListGroupsCommand";
import type { IAMPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListGroups: (config: IAMPaginationConfiguration, input: ListGroupsCommandInput, ...rest: any[]) => Paginator<ListGroupsCommandOutput>;
