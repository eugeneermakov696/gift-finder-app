import { type WaiterConfiguration, type WaiterResult } from "@smithy/core/client";
import { type GetFunctionCommandInput, type GetFunctionCommandOutput } from "../commands/GetFunctionCommand";
import type { LambdaClient } from "../LambdaClient";
import type { LambdaServiceException } from "../models/LambdaServiceException";
/**
 * Waits for the function's LastUpdateStatus to be Successful. This waiter uses GetFunction API. This should be used after function updates.
 *  @deprecated Use waitUntilFunctionUpdatedV2 instead. waitForFunctionUpdatedV2 does not throw error in non-success cases.
 */
export declare const waitForFunctionUpdatedV2: (params: WaiterConfiguration<LambdaClient>, input: GetFunctionCommandInput) => Promise<WaiterResult<GetFunctionCommandOutput | LambdaServiceException>>;
/**
 * Waits for the function's LastUpdateStatus to be Successful. This waiter uses GetFunction API. This should be used after function updates.
 *  @param params - Waiter configuration options.
 *  @param input - The input to GetFunctionCommand for polling.
 */
export declare const waitUntilFunctionUpdatedV2: (params: WaiterConfiguration<LambdaClient>, input: GetFunctionCommandInput) => Promise<WaiterResult<GetFunctionCommandOutput>>;
