import type { Paginator } from "@smithy/types";
import { GetAccountAuthorizationDetailsCommandInput, GetAccountAuthorizationDetailsCommandOutput } from "../commands/GetAccountAuthorizationDetailsCommand";
import type { IAMPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateGetAccountAuthorizationDetails: (config: IAMPaginationConfiguration, input: GetAccountAuthorizationDetailsCommandInput, ...rest: any[]) => Paginator<GetAccountAuthorizationDetailsCommandOutput>;
