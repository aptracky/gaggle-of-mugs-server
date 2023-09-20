import { Queue } from "aws-cdk-lib/aws-sqs";
import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as GaggleOfMugsServer from "../lib/gaggle-of-mugs-server-stack";

test("SQS Queue Created", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new GaggleOfMugsServer.GaggleOfMugsServerStack(
    app,
    "visitQueue"
  );
  // THEN
  const template = Template.fromStack(stack);

  template.hasResourceProperties("AWS::SQS::Queue", {
    QueueName: "visitQueue",
  });
});
