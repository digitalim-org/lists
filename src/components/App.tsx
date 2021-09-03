import React from "react";
import Amplify from "aws-amplify";
import { AmplifyAuthenticator } from "@aws-amplify/ui-react";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import { useApolloClient } from "@apollo/client";
import { TodosList } from "./pages";
import awsconfig from "../aws-exports";
import "./App.css";

Amplify.configure(awsconfig);

const App: React.FunctionComponent = () => {
  const [authState, setAuthState] = React.useState<AuthState>();
  const [user, setUser] = React.useState<object | undefined>();
  const client = useApolloClient();

  React.useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData);
      if (nextAuthState === AuthState.SignedOut) {
        client.clearStore();
      }
    });
  });

  return authState === AuthState.SignedIn && user ? (
    <TodosList />
  ) : (
    <AmplifyAuthenticator />
  );
};

export default App;
