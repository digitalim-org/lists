import { Stack, StackProps, Construct, RemovalPolicy } from "@aws-cdk/core";
import { Distribution } from "@aws-cdk/aws-cloudfront";
import { S3Origin } from "@aws-cdk/aws-cloudfront-origins";
import { APP_NAME } from "../config";
import { Bucket } from "@aws-cdk/aws-s3";

export class CloudFrontStack extends Stack {
  public readonly deploymentBucket: Bucket;
  public readonly webDistribution: Distribution;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const deploymentBucket = new Bucket(
      this,
      `${APP_NAME}-S3DeploymentBucket`,
      {
        removalPolicy: RemovalPolicy.DESTROY,
        versioned: true,
      }
    );

    this.deploymentBucket = deploymentBucket;

    this.webDistribution = new Distribution(
      this,
      `${APP_NAME}-CloudFrontDistribution`,
      {
        defaultBehavior: {
          origin: new S3Origin(deploymentBucket),
        },
        defaultRootObject: "index.html",
      }
    );
  }
}
