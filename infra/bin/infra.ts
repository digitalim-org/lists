#!/usr/bin/env node
import "source-map-support/register";
import { App } from "@aws-cdk/core";
import { CognitoStack } from "../lib/cognito";

const app = new App();
new CognitoStack(app, "CognitoStack");
