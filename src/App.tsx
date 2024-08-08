import React, { useState } from "react";
import Todo from "./components/todo/Todo";
//import Todos from "./components/todo/Todored";

function App() {
  return (
    <div className="background">
      <div className="todos">
        <h1>todos</h1>
        <Todo/>
      </div>
    </div>
  );
}
export default App;
