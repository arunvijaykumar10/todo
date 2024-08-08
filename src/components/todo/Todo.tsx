import React, { useReducer } from "react";
import "./Todo.css";

interface Task {
  task: string;
  completed: boolean;
}

interface State {
  tasks: Task[];
  filter: string;
  input: string;
}

type Action =
  | { type: "add-task"; payload: string }
  | { type: "ticking-task"; payload: number }
  | { type: "delete-task"; payload: number}
  | { type: "select-all" }
  | { type: "set-filter"; payload: string }
  | { type: "clear-completed" }
  | { type: "set-input"; payload:string };

const initialState: State = {
  tasks: [],
  filter: "All",
  input: "",
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "set-input":
      return {...state,input:action.payload};
    case "add-task":
      return {
        ...state,
        tasks: [...state.tasks, { task: action.payload, completed: false }],
        input: "",
      };
    case "ticking-task":
      return {
        ...state,
        tasks: state.tasks.map((task, index) =>
          index === action.payload? { ...task, completed: !task.completed }: task)
      };
    case "delete-task":
      return {
        ...state,tasks: state.tasks.filter((ele, index) => index!== action.payload),
      };
    case "select-all":
      const allSelected = state.tasks.every((task) => !task.completed);
      return {
        ...state,
        tasks: state.tasks.map((task) => ({
          ...task,
          completed:allSelected,
        })),
      };
    case "set-filter":
      return {
        ...state,filter:action.payload,
      };
      case "clear-completed":
        return{...state,tasks:state.tasks.filter((task)=>task.completed)

        };
   
    default:
      return state;
  }
};

function Todo() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    dispatch({ type: "ticking-task", payload: index });
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

  return (
    <div className="App">
      <button type="button" className="btn select" onClick={selectAll}>
        {state.tasks.every((task) => task.completed) ? "Deselect All" : "Select All"}
      </button>
      <input
        type="text"
        value={state.input}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        placeholder="What needs to be done?"
        className="head"
      />

      <div className="body">
        {filteredTasks.map((task, index) => (
          <div className="check" key={index}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleCheckboxChange(index)}
            />
            <label>{task.task}</label>
            <button onClick={() => dispatch({ type: "delete-task",payload:index})}>
              X
            </button>
          </div>
        ))}
      </div>

      <button className="btn left">{`${state.tasks.length} items left!`}</button>
      <button className="btn all" onClick={() => dispatch({ type: "set-filter", payload: "All" })}>
        All
      </button>
      <button className="btn active" onClick={() => dispatch({ type: "set-filter", payload: "Active" })}>
        Active
      </button>
      <button className="btn completed" onClick={() => dispatch({ type: "set-filter", payload: "Completed" })}>
        Completed
      </button>
      <button className="btn clear" onClick={() => dispatch({ type: "clear-completed" })}>
        Clear completed
      </button>
    </div>
  );
}
export default Todo;