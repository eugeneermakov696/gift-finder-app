import type { Paginator } from "@smithy/types";
import { SimulatePrincipalPolicyCommandInput, SimulatePrincipalPolicyCommandOutput } from "../commands/SimulatePrincipalPolicyCommand";
import type { IAMPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateSimulatePrincipalPolicy: (config: IAMPaginationConfiguration, input: SimulatePrincipalPolicyCommandInput, ...rest: any[]) => Paginator<SimulatePrincipalPolicyCommandOutput>;
