import React from 'react';
import { Counter } from './features/counter/Counter';
import './App.css';
import Home from './pages/Home';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <Counter /> */}
        <Home />
      </header>
    </div>
  );
}

export default App;
