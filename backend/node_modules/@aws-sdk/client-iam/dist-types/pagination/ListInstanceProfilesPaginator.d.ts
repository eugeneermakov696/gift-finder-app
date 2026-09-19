import type { Paginator } from "@smithy/types";
import { ListInstanceProfilesCommandInput, ListInstanceProfilesCommandOutput } from "../commands/ListInstanceProfilesCommand";
import type { IAMPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListInstanceProfiles: (config: IAMPaginationConfiguration, input: ListInstanceProfilesCommandInput, ...rest: any[]) => Paginator<ListInstanceProfilesCommandOutput>;
