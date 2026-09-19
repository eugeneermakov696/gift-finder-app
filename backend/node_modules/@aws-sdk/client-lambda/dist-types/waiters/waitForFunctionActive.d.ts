import { type WaiterConfiguration, type WaiterResult } from "@smithy/core/client";
import { type GetFunctionConfigurationCommandInput, type GetFunctionConfigurationCommandOutput } from "../commands/GetFunctionConfigurationCommand";
import type { LambdaClient } from "../LambdaClient";
import type { LambdaServiceException } from "../models/LambdaServiceException";
/**
 * Waits for the function's State to be Active. This waiter uses GetFunctionConfiguration API. This should be used after new function creation.
 *  @deprecated Use waitUntilFunctionActive instead. waitForFunctionActive does not throw error in non-success cases.
 */
export declare const waitForFunctionActive: (params: WaiterConfiguration<LambdaClient>, input: GetFunctionConfigurationCommandInput) => Promise<WaiterResult<GetFunctionConfigurationCommandOutput | LambdaServiceException>>;
/**
 * Waits for the function's State to be Active. This waiter uses GetFunctionConfiguration API. This should be used after new function creation.
 *  @param params - Waiter configuration options.
 *  @param input - The input to GetFunctionConfigurationCommand for polling.
 */
export declare const waitUntilFunctionActive: (params: WaiterConfiguration<LambdaClient>, input: GetFunctionConfigurationCommandInput) => Promise<WaiterResult<GetFunctionConfigurationCommandOutput>>;
