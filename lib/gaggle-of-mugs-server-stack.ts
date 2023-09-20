import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { Lambda } from "aws-cdk-lib/aws-ses-actions";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

export class GaggleOfMugsServerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const visitDLQ = new Queue(this, "visitDLQ", {
      queueName: "visitDLQ",
      retentionPeriod: Duration.days(14),
    });

    // Visit SQS Queue
    const visitQueue = new Queue(this, "visitQueue", {
      queueName: "visitQueue",
      deadLetterQueue: {
        queue: visitDLQ,
        maxReceiveCount: 3,
      },
    });

    // Visit Table
    const visitTable = new Table(this, "visits", {
      partitionKey: { name: "visitId", type: AttributeType.STRING },
      sortKey: { name: "locationId", type: AttributeType.STRING },
    });
  }
}
