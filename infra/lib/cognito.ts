import { Stack, StackProps, Construct } from "@aws-cdk/core";
import { Mfa, UserPool } from "@aws-cdk/aws-cognito";
import { APP_NAME } from "../config";

export class CognitoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new UserPool(this, `${APP_NAME}-CognitoUserPool`, {
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
        username: true,
        phone: false,
      },
      autoVerify: {
        phone: true,
      },
      mfa: Mfa.OFF,
      passwordPolicy: {
        minLength: 12,
      },
      emailSettings: {
        replyTo: "pierre.pirault@outlook.com",
      },
    });
  }
}
