import { produce } from "immer";
import _ from "lodash";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useReducer
} from "react";

interface Task {
  task: string;
  completed: boolean;
}

interface TodoContexttype {
  taskData: State;
  newTask: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  toggleTask: (index: number) => void;
  selectAll: () => void;
  setInput: React.ChangeEventHandler<HTMLInputElement>;
  setAll: () => void;
  setCompleted: () => void;
  setActive: () => void;
  clearCompleted: () => void;
  deleteTask: (index: number) => void;
}

interface State {
  tasks: Task[];
  filter: string;
  input: string;
  filteredTasks: Task[];
}

type Action =
  | { type: "add-task"; payload: string }
  | { type: "toggle-task"; payload: number }
  | { type: "delete-task"; payload: number }
  | { type: "select-all" }
  | { type: "set-filter"; payload: string }
  | { type: "clear-completed" }
  | { type: "set-input"; payload: string };

const initialState: State = {
  tasks: [],
  filter: "All",
  input: "",
  filteredTasks: [],
};

const reducer = produce((state: State, action: Action) => {
  switch (action.type) {
    case "set-input":
      state.input = action.payload;
      break;
    case "add-task":
      state.tasks = _.concat(state.tasks, {
        task: action.payload,
        completed: false,
      });
      state.filteredTasks = state.tasks;
      state.input = "";
      break;
    case "toggle-task":
      const taskToToggle = state.tasks[action.payload];
      if (taskToToggle) {
        taskToToggle.completed = !taskToToggle.completed;
      }
      state.filteredTasks = state.tasks;

      break;
    case "delete-task":
      state.tasks = _.remove(
        state.tasks,
        (task, index) => index !== action.payload
      );
      state.filteredTasks = state.tasks;

      break;
    case "select-all":
      const allSelected = _.every(state.tasks, "completed");
      state.tasks = _.map(state.tasks, (task) => ({
        ...task,
        completed: !allSelected,
      }));
      state.filteredTasks = state.tasks;
      break;
    case "set-filter":
      const filterType = action.payload;
      state.filteredTasks = _.filter(state.tasks, (task) => {
        if (filterType === "active") {
          return !task.completed;
        }
        if (filterType === "completed") {
          return task.completed;
        }
        return true;
      });
      break;
    case "clear-completed":
      state.tasks = _.filter(state.tasks, (task) => !task.completed);
      state.filteredTasks = state.tasks;
      break;
    default:
      break;
  }
});

const TodoContext = createContext<TodoContexttype | null>(null);

function TodoProvider({ children }: PropsWithChildren<{}>) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setInput: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    dispatch({ type: "set-input", payload: event.target.value });
  };

  const newTask = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const newTask = _.trim(state.input);
      if (newTask !== "") {
        dispatch({ type: "add-task", payload: newTask });
      }
    }
  };

  const toggleTask = (index: number) => {
    dispatch({ type: "toggle-task", payload: index });
  };
  const selectAll = () => {
    dispatch({ type: "select-all" });
  };
  const setAll = () => {
    dispatch({ type: "set-filter", payload: "all" });
  };
  const setActive = () => {
    dispatch({ type: "set-filter", payload: "active" });
  };

  const setCompleted = () => {
    dispatch({ type: "set-filter", payload: "completed" });
  };
  const clearCompleted = () => {
    dispatch({ type: "clear-completed" });
  };
  const deleteTask = (index: number) => {
    dispatch({ type: "delete-task", payload: index });
  };

  const value = {
    taskData: state,
    setAll,
    setActive,
    setCompleted,
    newTask,
    deleteTask,
    toggleTask,
    selectAll,
    setInput,
    clearCompleted,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("Todo must be used within a TodoProvider");
  }
  return context;
};

export default TodoProvider;
