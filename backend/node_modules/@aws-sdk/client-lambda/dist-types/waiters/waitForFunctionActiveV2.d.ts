import { type WaiterConfiguration, type WaiterResult } from "@smithy/core/client";
import { type GetFunctionCommandInput, type GetFunctionCommandOutput } from "../commands/GetFunctionCommand";
import type { LambdaClient } from "../LambdaClient";
import type { LambdaServiceException } from "../models/LambdaServiceException";
/**
 * Waits for the function's State to be Active. This waiter uses GetFunction API. This should be used after new function creation.
 *  @deprecated Use waitUntilFunctionActiveV2 instead. waitForFunctionActiveV2 does not throw error in non-success cases.
 */
export declare const waitForFunctionActiveV2: (params: WaiterConfiguration<LambdaClient>, input: GetFunctionCommandInput) => Promise<WaiterResult<GetFunctionCommandOutput | LambdaServiceException>>;
/**
 * Waits for the function's State to be Active. This waiter uses GetFunction API. This should be used after new function creation.
 *  @param params - Waiter configuration options.
 *  @param input - The input to GetFunctionCommand for polling.
 */
export declare const waitUntilFunctionActiveV2: (params: WaiterConfiguration<LambdaClient>, input: GetFunctionCommandInput) => Promise<WaiterResult<GetFunctionCommandOutput>>;
