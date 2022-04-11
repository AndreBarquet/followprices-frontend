import React, { Fragment } from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom";

// Components
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import QuickAccessButton from './Components/QuickAccessButton/QuickAccessButton';
import Navbar from './Components/Navbar/Navbar';

// date locale
import pt from 'date-fns/locale/pt-BR';

// Routes list
import routesList from './app/routes';

function BasicLayoutPages() {

  return (
    <LocalizationProvider locale={pt} dateAdapter={AdapterDateFns}>
      <Navbar routes={routesList} />
      <div style={{ paddingTop: 15, backgroundColor: '#f3f5f9', minHeight: '90vh' }}>
        <Routes>
          {routesList.map(currentRoute => (
            <Route path={currentRoute?.path} element={currentRoute?.component} />
          ))}
        </Routes>
      </div>
      <QuickAccessButton />
    </LocalizationProvider>
  );
}

export default BasicLayoutPages;
