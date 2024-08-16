import React from "react";
import "./Todo.css";
import { useTodoContext } from "./TodoProvider";
import _ from "lodash";

function TodoHeader() {
  const { taskData, newTask, setInput, selectAll } = useTodoContext();

  return (
    <div>
      <button type="button" className="btn select" onClick={selectAll}>
        {_.every(taskData.tasks, "completed") ? "Deselect All" : "Select All"}
      </button>
      <input
        type="text"
        value={taskData.input}
        onChange={setInput}
        onKeyDown={newTask}
        placeholder="What needs to be done?"
        className="head"
      />
    </div>
  );
}

function TodoList() {
  const { taskData, toggleTask, deleteTask } = useTodoContext();

  return (
    <div className="todoList">
      {_.map(taskData.filteredTasks, (task, index) => (
        <div className="check" key={task.task + index}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(index)}
          />
          <label>{task.task}</label>
          <button onClick={() => deleteTask(index)}>X</button>
        </div>
      ))}
    </div>
  );
}

function TodoFooter() {
  const { taskData, setAll, setActive, setCompleted, clearCompleted } =
    useTodoContext();

  return (
    <div className="footer">
      <h4 className="btn left">{`${taskData.tasks.length} items left!`}</h4>
      <button className="btn all" onClick={() => setAll()}>
        All
      </button>
      <button className="btn active" onClick={() => setActive()}>
        Active
      </button>
      <button className="btn completed" onClick={() => setCompleted()}>
        Completed
      </button>
      <button className="btn clear" onClick={() => clearCompleted()}>
        Clear completed
      </button>
      <center className="info">
        <p>Created by Arunkumar</p>
      </center>
    </div>
  );
}

function Todo() {
  return (
    <div className="App">
      <TodoHeader />
      <TodoList />
      <TodoFooter />
    </div>
  );
}

export default Todo;
