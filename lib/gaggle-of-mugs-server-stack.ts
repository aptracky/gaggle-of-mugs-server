import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

export class GaggleOfMugsServerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Visit DLQ
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

    const handler = new Function(this, "visitFunction", {
      functionName: "visitFunction",
      code: Code.fromAsset("src"),
      handler: "visitFunction.handler",
      runtime: Runtime.NODEJS_18_X,
    });
  }
}
