import { useQuery } from "@apollo/client";
import { GET_TODOS } from "../../../gql";
import {
  Card,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  // Leave for mark-done functionality
  FormControlLabel,
  CircularProgress,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { AmplifySignOut } from "@aws-amplify/ui-react";
import { Todo as TodoComponent } from "../..";
import { Todo } from "../../../types";
import styles from "./TodosList.module.css";
import AddTodo from "../../AddTodo";
import { groupTodos } from "../../../util";

interface TodosList {
  getTodos: Todo[];
}

const TodosListComponent = () => {
  const { loading, error, data } = useQuery<TodosList>(GET_TODOS);

  if (error) {
    return (
      <div>
        <h1>ERROR</h1>
      </div>
    );
  }

  let todos: { [key: string]: Todo[] } = {};
  if (data) {
    const { getTodos: flatTodos } = data!;
    console.log("flat:", flatTodos);

    todos = groupTodos(flatTodos);
    console.log("grouped:", todos);
  }

  return (
    <div className={styles.page}>
      <AmplifySignOut />
      <Card className={styles.card}>
        {loading && <CircularProgress />}
        {Object.entries(todos).map(([_, todoList]) => {
          // All the todos in this list have the same listID
          const listID = todoList[0].listID;

          return (
            <Accordion key={listID}>
              {todoList.map((todo, idx) =>
                idx === 0 ? (
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    key={todo.itemID}
                  >
                    <TodoComponent {...todo} />
                  </AccordionSummary>
                ) : (
                  <AccordionDetails key={todo.itemID}>
                    <TodoComponent {...todo} />
                  </AccordionDetails>
                )
              )}
              <AddTodo listID={listID} />
            </Accordion>
          );
        })}
      </Card>
      <AddTodo />
    </div>
  );
};

export default TodosListComponent;
