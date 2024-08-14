import React from "react";
import Todo from "./components/todo/Todo";
import TodoProvider from "./components/todo/TodoProvider";

function App() {
  return (
    <div >
      <div className="todos">
        <h1>todos</h1>
        <TodoProvider>
          <Todo />
        </TodoProvider>
      </div>
    </div>
  );
}

export default App;
