import {
  Stack,
  StackProps,
  Construct,
  RemovalPolicy,
  CfnOutput,
} from "@aws-cdk/core";
import { Mfa, UserPool } from "@aws-cdk/aws-cognito";
import { APP_NAME } from "../config";

export class CognitoStack extends Stack {
  public readonly userPool: UserPool;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const userPool = new UserPool(this, `${APP_NAME}-CognitoUserPool`, {
      removalPolicy: RemovalPolicy.DESTROY,
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
        username: true,
        phone: false,
      },
      mfa: Mfa.OFF,
      passwordPolicy: {
        minLength: 12,
      },
      emailSettings: {
        replyTo: "pierre.pirault@outlook.com",
      },
    });

    this.userPool = userPool;

    const userPoolClient = this.userPool.addClient("WebClient");

    new CfnOutput(this, "userPoolID", { value: userPool.userPoolId });
    new CfnOutput(this, "webClientID", {
      value: userPoolClient.userPoolClientId,
    });
  }
}
