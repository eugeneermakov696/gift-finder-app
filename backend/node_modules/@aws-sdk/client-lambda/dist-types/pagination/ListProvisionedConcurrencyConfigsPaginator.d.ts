import type { Paginator } from "@smithy/types";
import { ListProvisionedConcurrencyConfigsCommandInput, ListProvisionedConcurrencyConfigsCommandOutput } from "../commands/ListProvisionedConcurrencyConfigsCommand";
import type { LambdaPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListProvisionedConcurrencyConfigs: (config: LambdaPaginationConfiguration, input: ListProvisionedConcurrencyConfigsCommandInput, ...rest: any[]) => Paginator<ListProvisionedConcurrencyConfigsCommandOutput>;
