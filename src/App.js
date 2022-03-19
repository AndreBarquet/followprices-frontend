import React from 'react';
// import { Counter } from './features/counter/Counter';
import './App.css';
import Home from './pages/Home';

import axios from "axios";
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';


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
