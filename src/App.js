import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

//import pages
import PageNotFound from './pages/PageNotFound';
import BasicLayoutPages from './BasicLayoutPages';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/*" element={<BasicLayoutPages />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
