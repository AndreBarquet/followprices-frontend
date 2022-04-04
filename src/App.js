import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

//import pages
import SignIn from './pages/SignIn';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
