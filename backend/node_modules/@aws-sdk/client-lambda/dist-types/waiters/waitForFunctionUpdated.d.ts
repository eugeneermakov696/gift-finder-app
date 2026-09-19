import { type WaiterConfiguration, type WaiterResult } from "@smithy/core/client";
import { type GetFunctionConfigurationCommandInput, type GetFunctionConfigurationCommandOutput } from "../commands/GetFunctionConfigurationCommand";
import type { LambdaClient } from "../LambdaClient";
import type { LambdaServiceException } from "../models/LambdaServiceException";
/**
 * Waits for the function's LastUpdateStatus to be Successful. This waiter uses GetFunctionConfiguration API. This should be used after function updates.
 *  @deprecated Use waitUntilFunctionUpdated instead. waitForFunctionUpdated does not throw error in non-success cases.
 */
export declare const waitForFunctionUpdated: (params: WaiterConfiguration<LambdaClient>, input: GetFunctionConfigurationCommandInput) => Promise<WaiterResult<GetFunctionConfigurationCommandOutput | LambdaServiceException>>;
/**
 * Waits for the function's LastUpdateStatus to be Successful. This waiter uses GetFunctionConfiguration API. This should be used after function updates.
 *  @param params - Waiter configuration options.
 *  @param input - The input to GetFunctionConfigurationCommand for polling.
 */
export declare const waitUntilFunctionUpdated: (params: WaiterConfiguration<LambdaClient>, input: GetFunctionConfigurationCommandInput) => Promise<WaiterResult<GetFunctionConfigurationCommandOutput>>;
