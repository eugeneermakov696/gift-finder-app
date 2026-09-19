import type { Paginator } from "@smithy/types";
import { ListEventSourceMappingsCommandInput, ListEventSourceMappingsCommandOutput } from "../commands/ListEventSourceMappingsCommand";
import type { LambdaPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListEventSourceMappings: (config: LambdaPaginationConfiguration, input: ListEventSourceMappingsCommandInput, ...rest: any[]) => Paginator<ListEventSourceMappingsCommandOutput>;
