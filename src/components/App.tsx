import React from "react";
import Amplify from "aws-amplify";
import { AmplifyAuthenticator } from "@aws-amplify/ui-react";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import { TodosList } from "./pages";
import awsconfig from "../aws-exports";
import "./App.css";

Amplify.configure(awsconfig);

const App: React.FunctionComponent = () => {
  const [authState, setAuthState] = React.useState<AuthState>();
  const [user, setUser] = React.useState<object | undefined>();

  React.useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData);
    });
  }, []);

  return authState === AuthState.SignedIn && user ? (
    <TodosList user={user} />
  ) : (
    <AmplifyAuthenticator />
  );
};

export default App;
