import { useState, ChangeEvent } from "react";
import { Button, Card, TextField, TextFieldProps } from "@material-ui/core";

type SimpleTextFieldProps = TextFieldProps & {
  name: string;
};

const SimpleTextField = ({ name, ...props }: SimpleTextFieldProps) => (
  <TextField id={name} label={name} name={name} {...props} />
);

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const changeUsername = (evt: ChangeEvent<HTMLInputElement>) => {
    setUsername(evt.target.value);
  };

  const changePassword = (evt: ChangeEvent<HTMLInputElement>) => {
    setPassword(evt.target.value);
  };

  const login = () => {
    console.log("do login");
  };

  const signup = () => {
    console.log("do signup");
  };

  return (
    <>
      <Card>
        <SimpleTextField
          name="username"
          value={username}
          onChange={changeUsername}
        />
        <SimpleTextField
          name="password"
          type="password"
          value={password}
          onChange={changePassword}
        />
        <Button type="button" onClick={login}>
          Login
        </Button>
        <Button type="button" onClick={signup}>
          Signup
        </Button>
      </Card>
    </>
  );
};

export default LoginPage;
