import { Todo } from "./types";

export const groupTodos = (todos: Todo[]) =>
  todos.reduce<{ [key: string]: Todo[] }>((groups, todo) => {
    groups[todo.listID] =
      groups[todo.listID] === undefined
        ? [todo]
        : [...groups[todo.listID], todo];
    return groups;
  }, {});
