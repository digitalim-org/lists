import { Chip } from "@material-ui/core";
import { formatRelative } from "date-fns";
import { Todo as TodoType } from "../../types";
import styles from "./Todo.module.css";

const Todo = ({ title, itemID }: TodoType) => (
  <div>
    <h3 className={styles.todoListTitle}>{title}</h3>
    <Chip
      variant="outlined"
      size="small"
      label={formatRelative(new Date(Number(itemID.split("#")[1])), new Date())}
    />
  </div>
);

export default Todo;
