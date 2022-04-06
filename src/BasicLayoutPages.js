import React, { Fragment } from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom";

// Components
import QuickAccessButton from './Components/QuickAccessButton/QuickAccessButton';
import Navbar from './Components/Navbar/Navbar';

// Routes list
import routesList from './app/routes';

function BasicLayoutPages() {

  return (
    <Fragment>
      <Navbar routes={routesList} />
      <div style={{ paddingTop: 15, backgroundColor: '#f3f5f9', height: '100vh' }}>
        <Routes>
          {routesList.map(currentRoute => (
            <Route path={currentRoute?.path} element={currentRoute?.component} />
          ))}
        </Routes>
      </div>
      <QuickAccessButton />
    </Fragment>
  );
}

export default BasicLayoutPages;
