import { Stack, Construct, SecretValue } from "@aws-cdk/core";
import { Pipeline, Artifact } from "@aws-cdk/aws-codepipeline";
import {
  GitHubSourceAction,
  S3DeployAction,
  CodeBuildAction,
} from "@aws-cdk/aws-codepipeline-actions";
import { PipelineProject, BuildSpec } from "@aws-cdk/aws-codebuild";
import { Bucket } from "@aws-cdk/aws-s3";
import { Distribution } from "@aws-cdk/aws-cloudfront";
import { PolicyStatement } from "@aws-cdk/aws-iam";
import { APP_NAME } from "../config";

interface CodePipelineStackProps {
  deploymentBucket: Bucket;
  webDistribution: Distribution;
}

export class CodePipelineStack extends Stack {
  public readonly deploymentBucket: Bucket;

  invalidateCacheCodeBuild(webDistribution: Distribution) {
    const codeBuildProject = new PipelineProject(this, `InvalidateProject`, {
      buildSpec: BuildSpec.fromObject({
        version: "0.2",
        phases: {
          build: {
            commands: [
              // eslint-disable-next-line no-template-curly-in-string
              'aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_ID} --paths "/index.html"',
            ],
          },
        },
      }),
      environmentVariables: {
        CLOUDFRONT_ID: { value: webDistribution.distributionId },
      },
    });

    // Add Cloudfront invalidation permissions to the project
    const distributionArn = `arn:aws:cloudfront::${this.account}:distribution/${webDistribution.distributionId}`;
    codeBuildProject.addToRolePolicy(
      new PolicyStatement({
        resources: [distributionArn],
        actions: ["cloudfront:CreateInvalidation"],
      })
    );

    return codeBuildProject;
  }

  constructor(
    scope: Construct,
    id: string,
    { deploymentBucket, webDistribution, ...props }: CodePipelineStackProps
  ) {
    super(scope, id, props);

    const sourceCodeS3 = new Artifact();
    const deploymentArtifact = new Artifact();

    new Pipeline(this, `${APP_NAME}-CodePipeline`, {
      restartExecutionOnUpdate: true,
      stages: [
        {
          stageName: "source",
          actions: [
            new GitHubSourceAction({
              actionName: "GithubSource",
              owner: "papiro",
              repo: "vendia-tech-screen",
              branch: "develop",
              oauthToken: SecretValue.secretsManager("vendia/github/token"),
              output: sourceCodeS3,
            }),
          ],
        },
        {
          stageName: "build",
          actions: [
            new CodeBuildAction({
              actionName: "CodeBuild",
              input: sourceCodeS3,
              project: new PipelineProject(this, `${APP_NAME}-CodeBuild`),
              outputs: [deploymentArtifact],
            }),
          ],
        },
        {
          stageName: "deploy",
          actions: [
            new S3DeployAction({
              actionName: "S3Deploy",
              bucket: deploymentBucket,
              input: deploymentArtifact,
            }),
            new CodeBuildAction({
              actionName: "InvalidateCache",
              input: deploymentArtifact,
              project: this.invalidateCacheCodeBuild(webDistribution),
            }),
          ],
        },
      ],
    });

    this.deploymentBucket = deploymentBucket;
  }
}
