import { Paginator } from "@smithy/types";
import {
  DescribeEventsCommandInput,
  DescribeEventsCommandOutput,
} from "../commands/DescribeEventsCommand";
import { CloudFormationPaginationConfiguration } from "./Interfaces";
export declare const paginateDescribeEvents: (
  config: CloudFormationPaginationConfiguration,
  input: DescribeEventsCommandInput,
  ...rest: any[]
) => Paginator<DescribeEventsCommandOutput>;
