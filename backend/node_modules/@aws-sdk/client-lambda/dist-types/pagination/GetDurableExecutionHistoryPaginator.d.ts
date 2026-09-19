import type { Paginator } from "@smithy/types";
import { GetDurableExecutionHistoryCommandInput, GetDurableExecutionHistoryCommandOutput } from "../commands/GetDurableExecutionHistoryCommand";
import type { LambdaPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateGetDurableExecutionHistory: (config: LambdaPaginationConfiguration, input: GetDurableExecutionHistoryCommandInput, ...rest: any[]) => Paginator<GetDurableExecutionHistoryCommandOutput>;
