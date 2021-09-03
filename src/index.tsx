import React from "react";
import ReactDOM from "react-dom";
import { createAuthLink, AUTH_TYPE, AuthOptions } from "aws-appsync-auth-link";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  ApolloLink,
  createHttpLink,
} from "@apollo/client";
import { Auth } from "aws-amplify";
import cfg from "./aws-exports";
// import { Rehydrated } from "aws-appsync-react";
import "./index.css";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";

const url = cfg.graphqlEndpoint;
const region = cfg.aws_region;
const auth: AuthOptions = {
  type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
  // apiKey: AppSyncConfig.apiKey,
  jwtToken: async () => {
    return Auth.currentSession().then((data) => {
      console.log(data);
      return data.getAccessToken().getJwtToken();
    });
  },
};

const httpLink = createHttpLink({ uri: url });

const link = ApolloLink.from([createAuthLink({ url, region, auth }), httpLink]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache({
    typePolicies: {
      Todo: {
        keyFields: ["itemID"],
      },
    },
  }),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    {/* <Rehydrated> */}
    <React.StrictMode>
      <App />
    </React.StrictMode>
    {/* </Rehydrated> */}
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
