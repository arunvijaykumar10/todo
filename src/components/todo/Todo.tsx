import React, {useState } from "react";
import "./Todo.css";

interface Task {
  task: string;
  completed: boolean;
}

function Todo() {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filtered,setFiltered] = useState("All");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const trimmedInput = input.trim();
      if (trimmedInput !== "") {
        setTasks([...tasks, { task: trimmedInput, completed: false }]);
        setInput("");
      }
    }
  };
  
  const handleCheckboxChange = (index: number) => {
    setTasks(
      tasks.map((task, idx) =>
        idx === index ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const selectAll = () => {
    const allSelected = tasks.every(task => task.completed);
    setTasks(tasks.map(task => ({ ...task, completed: !allSelected })));
  };

  const sortedTasks = tasks.filter(task => {
    if (filtered === "Active") {
      return !task.completed;
    }
    if (filtered === "Completed") {
      return task.completed;
    }
    return true;
  });
  return (
    <div className="App">
      <button type="button" className="btn select" onClick={selectAll}>
        {tasks.every(task => task.completed) ? "Deselect All" : "Select All"}
      </button>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        placeholder="What needs to be done?"
        className="head"
      />

      <div className="body">
        {sortedTasks.map((task, index) => (
          <div className="check" key={index}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleCheckboxChange(index)}
            />
            <label>
              {task.task}
            </label>
            <button onClick={() => setTasks(tasks.filter((item, idx) => idx !== index))}>X</button>
          </div>
        ))}
      </div>

      <button className="btn left">{`${tasks.length} items left!`}</button>
      <button className="btn all" onClick={() =>setFiltered("All")}>All</button>
      <button className="btn active" onClick={() =>setFiltered("Active")}>Active</button>
      <button className="btn completed" onClick={() =>setFiltered("Completed")}>Completed</button>
      <button
        className="btn clear"
        onClick={() => {
          const newTasks = tasks.filter(task => !task.completed);
          setTasks(newTasks);
        }}
      >
        Clear completed
      </button>
    </div>
  );
}

export default Todo;