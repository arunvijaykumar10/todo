import React from "react";
import "./Todo.css";
import { useTodoContext } from "./TodoProvider";
import _ from 'lodash';

function TodoHeader() {
  const { taskData, newTask, setInput, selectAll } = useTodoContext();

  return (
    <div>
      <button type="button" className="btn select" onClick={selectAll}>
        {_.every(taskData.tasks, 'completed') ? 'Deselect All' : 'Select All'}
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
  const { taskData, toggleTask, dispatch } = useTodoContext();

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
          <button onClick={() => dispatch({ type: "delete-task", payload: index })}>
            X
          </button>
        </div>
      ))}
    </div>
  );
}

function TodoFooter() {
  const { taskData, dispatch } = useTodoContext();
  
  const incompleteTasksCount = taskData.tasks.filter(task => !task.completed).length;

  return (
    <div className="footer">
      <h4 className="btn left">{`${incompleteTasksCount} items left!`}</h4>
      
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
      <center className='info'>
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
