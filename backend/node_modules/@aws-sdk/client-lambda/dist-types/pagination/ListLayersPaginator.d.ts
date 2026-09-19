import type { Paginator } from "@smithy/types";
import { ListLayersCommandInput, ListLayersCommandOutput } from "../commands/ListLayersCommand";
import type { LambdaPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListLayers: (config: LambdaPaginationConfiguration, input: ListLayersCommandInput, ...rest: any[]) => Paginator<ListLayersCommandOutput>;
