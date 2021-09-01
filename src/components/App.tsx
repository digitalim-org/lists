import React from "react";
import Amplify from "aws-amplify";
import { AmplifyAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import awsconfig from "../aws-exports";
import logo from "../logo.svg";
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
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <AmplifySignOut />
    </div>
  ) : (
    <AmplifyAuthenticator />
  );
};

export default App;
