import type { Paginator } from "@smithy/types";
import { ListFunctionsByCodeSigningConfigCommandInput, ListFunctionsByCodeSigningConfigCommandOutput } from "../commands/ListFunctionsByCodeSigningConfigCommand";
import type { LambdaPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListFunctionsByCodeSigningConfig: (config: LambdaPaginationConfiguration, input: ListFunctionsByCodeSigningConfigCommandInput, ...rest: any[]) => Paginator<ListFunctionsByCodeSigningConfigCommandOutput>;
