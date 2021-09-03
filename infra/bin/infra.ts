#!/usr/bin/env node
import "source-map-support/register";
import { App } from "@aws-cdk/core";
import { CognitoStack } from "../lib/cognito";
import { AppSyncStack } from "../lib/appsync";

const app = new App();

const { userPool } = new CognitoStack(app, "CognitoStack");
new AppSyncStack(app, "AppSyncStack", { userPool });
