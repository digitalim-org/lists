import infraCfg from "./cdk-exports.json";

const appCfg = {
  aws_region: "us-east-1",
  aws_user_pools_id: infraCfg.CognitoStack.userPoolID,
  aws_user_pools_web_client_id: infraCfg.CognitoStack.webClientID,
  graphqlEndpoint: infraCfg.AppSyncStack.apiEndpoint,
};

export default appCfg;
