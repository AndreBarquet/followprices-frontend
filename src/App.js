import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

//import pages
import PageNotFound from './pages/PageNotFound';
import BasicLayoutPages from './BasicLayoutPages';
import Login from './pages/Login';
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <SnackbarProvider maxSnack={3} /*anchorOrigin={{ vertical: 'top', horizontal: 'right' }}*/ autoHideDuration={5000}>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/*" element={(<BasicLayoutPages />)} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>=
    </SnackbarProvider>
  );
}

export default App;
