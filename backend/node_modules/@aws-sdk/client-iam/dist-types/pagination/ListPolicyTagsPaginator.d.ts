import type { Paginator } from "@smithy/types";
import { ListPolicyTagsCommandInput, ListPolicyTagsCommandOutput } from "../commands/ListPolicyTagsCommand";
import type { IAMPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListPolicyTags: (config: IAMPaginationConfiguration, input: ListPolicyTagsCommandInput, ...rest: any[]) => Paginator<ListPolicyTagsCommandOutput>;
