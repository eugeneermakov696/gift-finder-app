import type { Paginator } from "@smithy/types";
import { ListCodeSigningConfigsCommandInput, ListCodeSigningConfigsCommandOutput } from "../commands/ListCodeSigningConfigsCommand";
import type { LambdaPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListCodeSigningConfigs: (config: LambdaPaginationConfiguration, input: ListCodeSigningConfigsCommandInput, ...rest: any[]) => Paginator<ListCodeSigningConfigsCommandOutput>;
