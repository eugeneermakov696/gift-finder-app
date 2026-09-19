import type { Paginator } from "@smithy/types";
import { ListSAMLProviderTagsCommandInput, ListSAMLProviderTagsCommandOutput } from "../commands/ListSAMLProviderTagsCommand";
import type { IAMPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListSAMLProviderTags: (config: IAMPaginationConfiguration, input: ListSAMLProviderTagsCommandInput, ...rest: any[]) => Paginator<ListSAMLProviderTagsCommandOutput>;
