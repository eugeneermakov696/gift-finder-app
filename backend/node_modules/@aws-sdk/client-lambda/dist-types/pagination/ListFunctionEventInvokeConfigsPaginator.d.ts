import type { Paginator } from "@smithy/types";
import { ListFunctionEventInvokeConfigsCommandInput, ListFunctionEventInvokeConfigsCommandOutput } from "../commands/ListFunctionEventInvokeConfigsCommand";
import type { LambdaPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListFunctionEventInvokeConfigs: (config: LambdaPaginationConfiguration, input: ListFunctionEventInvokeConfigsCommandInput, ...rest: any[]) => Paginator<ListFunctionEventInvokeConfigsCommandOutput>;
