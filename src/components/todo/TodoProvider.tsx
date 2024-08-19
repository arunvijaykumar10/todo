import React, {
  useReducer,
  createContext,
  PropsWithChildren,
  useContext,
} from "react";
import _ from 'lodash';
import { produce } from "immer";

interface Task {
  task: string;
  completed: boolean;
}

interface TodoContextType {
  taskData: State; 
  dispatch: React.Dispatch<Action>;
  newTask: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  toggleTask: (index: number) => void;
  selectAll: () => void;
  setInput: React.ChangeEventHandler<HTMLInputElement>;
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
      state.tasks = _.concat(state.tasks, { task: action.payload, completed: false });
      state.input = "";
      state.filteredTasks = applyFilter(state.tasks, state.filter);
      break;
    case "toggle-task":
      if (state.tasks[action.payload]) {
        state.tasks[action.payload].completed = !state.tasks[action.payload].completed;
      }
      state.filteredTasks = applyFilter(state.tasks, state.filter);
      break;
    case "delete-task":
      state.tasks = _.filter(state.tasks, (task, index) => index !== action.payload);
      state.filteredTasks = applyFilter(state.tasks, state.filter);
      break;
    case "select-all":
      const allSelected = _.every(state.tasks, 'completed');
      state.tasks = _.map(state.tasks, (task) => ({ ...task, completed: !allSelected }));
      state.filteredTasks = applyFilter(state.tasks, state.filter);
      break;
    case "set-filter":
      state.filter = action.payload;
      state.filteredTasks = applyFilter(state.tasks, state.filter);
      break;
    case "clear-completed":
      state.tasks = _.filter(state.tasks, (task) => !task.completed);
      state.filteredTasks = applyFilter(state.tasks, state.filter);
      break;
    default:
      break;
  }
});

const applyFilter = (tasks: Task[], filter: string): Task[] => {
  switch (filter) {
    case "Active":
      return tasks.filter(task => !task.completed);
    case "Completed":
      return tasks.filter(task => task.completed);
    default:
      return tasks;
  }
};

const TodoContext = createContext<TodoContextType | null>(null);

function TodoProvider({ children }: PropsWithChildren<{}>) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setInput: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    dispatch({ type: "set-input", payload: event.target.value });
  };

  const newTask = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const newTask = state.input.trim();
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

  const value = {
    taskData: state, 
    dispatch,
    newTask,
    toggleTask,
    selectAll,
    setInput,
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
