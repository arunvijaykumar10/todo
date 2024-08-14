import React, {
  useReducer,
  createContext,
  PropsWithChildren,
  useContext,
} from "react";
import { produce } from "immer";

interface Task {
  task: string;
  completed: boolean;
}

interface TodoContexttype {
  taskData: State; 
  dispatch: React.Dispatch<Action>;
  handleKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  handleCheckboxChange: (index: number) => void;
  selectAll: () => void;
  handleInputChange: React.ChangeEventHandler<HTMLInputElement>;
  filteredTasks: Task[]; 
}

interface State {
  tasks: Task[];
  filter: string;
  input: string;
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
};

const reducer = produce((state: State, action: Action) => {
  switch (action.type) {
    case "set-input":
      state.input = action.payload;
      break;
    case "add-task":
      state.tasks.push({ task: action.payload, completed: false });
      state.input = "";
      break;
    case "toggle-task":
      state.tasks[action.payload].completed =
        !state.tasks[action.payload].completed;
      break;
    case "delete-task":
      state.tasks.splice(action.payload, 1);
      break;
    case "select-all":
      const allSelected = state.tasks.every((task) => task.completed);
      state.tasks.forEach((task) => (task.completed = !allSelected));
      break;
    case "set-filter":
      state.filter = action.payload;
      break;
    case "clear-completed":
      state.tasks = state.tasks.filter((task) => !task.completed);
      break;
    default:
      break;
  }
});

const TodoContext = createContext<TodoContexttype | null>(null);

function TodoProvider({ children }: PropsWithChildren<{}>) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    dispatch({ type: "set-input", payload: event.target.value });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const trimmedInput = state.input.trim();
      if (trimmedInput !== "") {
        dispatch({ type: "add-task", payload: trimmedInput });
      }
    }
  };

  const handleCheckboxChange = (index: number) => {
    dispatch({ type: "toggle-task", payload: index });
  };

  const selectAll = () => {
    dispatch({ type: "select-all" });
  };

  const filteredTasks = state.tasks.filter((task) => {
    if (state.filter === "Active") {
      return !task.completed;
    }
    if (state.filter === "Completed") {
      return task.completed;
    }
    return true;
  });

  const value = {
    taskData: state, 
    dispatch,
    handleKeyPress,
    handleCheckboxChange,
    selectAll,
    handleInputChange,
    filteredTasks 
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
