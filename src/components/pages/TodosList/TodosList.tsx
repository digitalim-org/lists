import { ChangeEvent, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TODOS, ADD_TODO } from "../../../gql";
import {
  Card,
  Chip,
  Box,
  IconButton,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  CircularProgress,
} from "@material-ui/core";
import {
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
} from "@material-ui/icons";
import { AmplifySignOut } from "@aws-amplify/ui-react";
import { formatRelative } from "date-fns";
import { Todo as TodoComponent } from "../..";
import { Todo } from "../../../types";
import styles from "./TodosList.module.css";

interface TodoPageProps {
  user: object;
}

interface TodosList {
  getTodos: Todo[];
}

const TodosListComponent = (props: TodoPageProps) => {
  const { loading, error, data } = useQuery<TodosList>(GET_TODOS);
  const [addTodo, { data: muData, loading: muLoading, error: muError }] =
    useMutation(ADD_TODO, {
      refetchQueries: [GET_TODOS],
    });
  const [listTitle, setListTitle] = useState("");
  const [itemTitle, setItemTitle] = useState("");
  console.log(muData);
  const changeListTitle = (evt: ChangeEvent<HTMLInputElement>) => {
    setListTitle(evt.target.value);
  };
  const changeItemTitle = (evt: ChangeEvent<HTMLInputElement>) => {
    setItemTitle(evt.target.value);
  };

  const handleAddTodoList = (evt: ChangeEvent<HTMLFormElement>) => {
    evt.preventDefault();
    addTodo({
      variables: {
        title: listTitle,
      },
    });
    setListTitle("");
  };

  const handleAddTodoItem = (id: string, evt: ChangeEvent<HTMLFormElement>) => {
    evt.preventDefault();
    addTodo({
      variables: {
        id,
        title: itemTitle,
      },
    });
    setItemTitle("");
  };
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

    todos = flatTodos.reduce<{ [key: string]: Todo[] }>((groups, todo) => {
      groups[todo.listID] =
        groups[todo.listID] === undefined
          ? [todo]
          : [...groups[todo.listID], todo];
      return groups;
    }, {});

    console.log("inflated:", todos);
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
            <Accordion>
              {todoList.map((todo, todoIdx) => {
                if (todoIdx === 0) {
                  return (
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <TodoComponent {...todo} />
                    </AccordionSummary>
                  );
                } else {
                  return (
                    <AccordionDetails>
                      <TodoComponent {...todo} />
                    </AccordionDetails>
                  );
                }
              })}
              <Box>
                <form
                  onSubmit={handleAddTodoItem.bind(null, listID)}
                  className={styles.addTodoListForm}
                >
                  <TextField
                    label="title"
                    value={itemTitle}
                    onChange={changeItemTitle}
                  />
                  <IconButton type="submit">
                    <AddIcon />
                    Submit
                  </IconButton>
                </form>
              </Box>
            </Accordion>
          );
        })}
      </Card>
      <Box>
        <form onSubmit={handleAddTodoList} className={styles.addTodoListForm}>
          <TextField
            label="title"
            value={listTitle}
            onChange={changeListTitle}
          />
          <IconButton type="submit">
            <AddIcon />
            Submit
          </IconButton>
        </form>
      </Box>
    </div>
  );
};

export default TodosListComponent;
