import React from "react";
import "./Todo.css";
import { useTodoContext } from "./TodoProvider";

function TodoHeader() {
  const { taskData, handleKeyPress, handleInputChange, selectAll } = useTodoContext();

  return (
    <div>
      <button type="button" className="btn select" onClick={selectAll}>
        {taskData.tasks.every((task) => task.completed) ? "Deselect All" : "Select All"}
      </button>
      <input
        type="text"
        value={taskData.input}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        placeholder="What needs to be done?"
        className="head"
      />
    </div>
  );
};


function TodoList() {
  const { filteredTasks, handleCheckboxChange, dispatch } = useTodoContext();

  return (
    <div>
      {filteredTasks.map((task: any, index: number) => (
        <div className="check" key={task.task + index}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => handleCheckboxChange(index)}
          />
          <label>{task.task}</label>
          <button onClick={() => dispatch({ type: "delete-task", payload: index })}>
            X
          </button>
        </div>
      ))}
    </div>
  );
};

function TodoFooter() {
  const { taskData, dispatch } = useTodoContext();

  return (
    <div>
      <button className="btn left">{`${taskData.tasks.length} items left!`}</button>
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
};
function Todo(){
  return (
    <div className="App">
      <TodoHeader />
      <TodoList />
      <TodoFooter />
    </div>
  );
};
export default Todo;