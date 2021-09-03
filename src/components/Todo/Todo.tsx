import { useMutation } from "@apollo/client";
import { Chip, IconButton } from "@material-ui/core";
import { DeleteForever as DeleteForeverIcon } from "@material-ui/icons";
import { formatRelative } from "date-fns";
import { SyntheticEvent } from "react";
import { DELETE_TODO } from "../../gql";
import { Todo as TodoType } from "../../types";
import styles from "./Todo.module.css";

const isSubItem = (itemID: string) => {
  const [listCreatedAt, itemCreatedAt] = itemID.split("#");
  return listCreatedAt !== itemCreatedAt;
};

const Todo = ({ title, itemID }: TodoType) => {
  const [deleteTodo, { error }] = useMutation(DELETE_TODO, {
    update(cache) {
      cache.modify({
        fields: {
          getTodos(todos = []) {
            const deleteIndex = todos.findIndex((todo: { __ref: string }) =>
              todo.__ref.includes(itemID)
            );
            return todos
              .slice(0, deleteIndex)
              .concat(todos.slice(deleteIndex + 1, todos.length));
          },
        },
      });
    },
  });

  if (error) {
    console.log(error);
  }

  const handleDelete = (evt: SyntheticEvent<HTMLButtonElement>) => {
    evt.stopPropagation();
    deleteTodo({ variables: { itemID } });
  };

  return (
    <div
      className={`${styles.todo} ${
        isSubItem(itemID) ? styles.todoSubItem : ""
      }`}
    >
      <IconButton onClick={handleDelete} className={styles.deleteButton}>
        <DeleteForeverIcon />
      </IconButton>
      <h3 className={styles.todoTitle}>{title}</h3>
      <Chip
        className={styles.creationTime}
        variant="outlined"
        size="small"
        label={formatRelative(
          new Date(Number(itemID.split("#")[1])),
          new Date()
        )}
      />
    </div>
  );
};

export default Todo;
