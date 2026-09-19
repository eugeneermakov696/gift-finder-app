import { type WaiterConfiguration, type WaiterResult } from "@smithy/core/client";
import { type GetFunctionCommandInput, type GetFunctionCommandOutput } from "../commands/GetFunctionCommand";
import type { LambdaClient } from "../LambdaClient";
import type { LambdaServiceException } from "../models/LambdaServiceException";
/**
 *
 *  @deprecated Use waitUntilFunctionExists instead. waitForFunctionExists does not throw error in non-success cases.
 */
export declare const waitForFunctionExists: (params: WaiterConfiguration<LambdaClient>, input: GetFunctionCommandInput) => Promise<WaiterResult<GetFunctionCommandOutput | LambdaServiceException>>;
/**
 *
 *  @param params - Waiter configuration options.
 *  @param input - The input to GetFunctionCommand for polling.
 */
export declare const waitUntilFunctionExists: (params: WaiterConfiguration<LambdaClient>, input: GetFunctionCommandInput) => Promise<WaiterResult<GetFunctionCommandOutput>>;
