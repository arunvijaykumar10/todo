import React from "react";
import Todo from "./components/todo/Todo";
import TodoProvider from "./components/todo/TodoProvider";

function App() {
  return (
    <div >
      <div >
        <h1 className="todos">todos</h1>
        <TodoProvider>
          <Todo />
        </TodoProvider>
      </div>
    </div>
  );
}

export default App;
