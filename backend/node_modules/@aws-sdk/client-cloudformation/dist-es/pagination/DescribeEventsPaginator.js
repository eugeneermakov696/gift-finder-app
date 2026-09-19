import { createPaginator } from "@smithy/core";
import { CloudFormationClient } from "../CloudFormationClient";
import { DescribeEventsCommand, } from "../commands/DescribeEventsCommand";
export const paginateDescribeEvents = createPaginator(CloudFormationClient, DescribeEventsCommand, "NextToken", "NextToken", "");
