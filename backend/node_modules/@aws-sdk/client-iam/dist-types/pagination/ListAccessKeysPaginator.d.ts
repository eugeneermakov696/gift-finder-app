import type { Paginator } from "@smithy/types";
import { ListAccessKeysCommandInput, ListAccessKeysCommandOutput } from "../commands/ListAccessKeysCommand";
import type { IAMPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListAccessKeys: (config: IAMPaginationConfiguration, input: ListAccessKeysCommandInput, ...rest: any[]) => Paginator<ListAccessKeysCommandOutput>;
