import { ChangeEvent, useState } from "react";
import { useMutation } from "@apollo/client";
import { TextField, IconButton } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import { ADD_TODO, GET_TODOS } from "../../gql";
import styles from "./AddTodo.module.css";
import { Todo } from "../../types";

interface AddTodoProps {
  //   handler(evt: ChangeEvent<HTMLFormElement>, listID?: string): void;
  listID?: string;
}

const AddTodo = ({ listID }: AddTodoProps) => {
  const [title, setTitle] = useState("");
  const [addTodo, { data, loading, error }] = useMutation(ADD_TODO, {
    refetchQueries: [GET_TODOS],
  });

  const handleChangeTitle = (evt: ChangeEvent<HTMLInputElement>) => {
    setTitle(evt.target.value);
  };

  // handleAddTodo adds a todo item to an existing listID if present and resets the todo input.
  const handleAddTodo = (evt: ChangeEvent<HTMLFormElement>) => {
    evt.preventDefault();
    addTodo({
      variables: {
        title: title,
        ...(listID && { listID }),
      },
    });
    setTitle("");
  };

  return (
    <form onSubmit={handleAddTodo} className={styles.addTodoListForm}>
      <TextField label="title" value={title} onChange={handleChangeTitle} />
      <IconButton type="submit">
        <AddIcon />
        Submit
      </IconButton>
    </form>
  );
};

export default AddTodo;