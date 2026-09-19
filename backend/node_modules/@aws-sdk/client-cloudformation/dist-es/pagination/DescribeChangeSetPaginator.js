import { createPaginator } from "@smithy/core";
import { CloudFormationClient } from "../CloudFormationClient";
import { DescribeChangeSetCommand, } from "../commands/DescribeChangeSetCommand";
export const paginateDescribeChangeSet = createPaginator(CloudFormationClient, DescribeChangeSetCommand, "NextToken", "NextToken", "");
