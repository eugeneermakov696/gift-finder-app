import type { Paginator } from "@smithy/types";
import { ListInstanceProfileTagsCommandInput, ListInstanceProfileTagsCommandOutput } from "../commands/ListInstanceProfileTagsCommand";
import type { IAMPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListInstanceProfileTags: (config: IAMPaginationConfiguration, input: ListInstanceProfileTagsCommandInput, ...rest: any[]) => Paginator<ListInstanceProfileTagsCommandOutput>;
