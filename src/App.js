import React, { useRef } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// COmponents
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { SnackbarProvider } from 'notistack';

//import pages
import PageNotFound from './pages/PageNotFound';
import BasicLayoutPages from './BasicLayoutPages';
import Login from './pages/Login';


function App() {
  const notistackRef = useRef();
  const useCloseIcon = true;
  const closeWithoutIcon = { height: '100%', position: 'absolute', top: 0, right: 0, color: 'white' };
  const closeNotificationWithoutIcon = { height: '100%', position: 'absolute', top: 0, left: 0, width: '100%' };

  const notificationCloseBtn = (key) => (
    <IconButton onClick={() => notistackRef.current.closeSnackbar(key)} style={useCloseIcon ? closeWithoutIcon : closeNotificationWithoutIcon} styleType="link">
      {useCloseIcon && <Close />}
    </IconButton>
  );

  return (
    <SnackbarProvider
      ref={notistackRef}
      maxSnack={3}
      /*anchorOrigin={{ vertical: 'top', horizontal: 'right' }}*/
      autoHideDuration={6000}
      preventDuplicate
      dense
      action={notificationCloseBtn}
    >
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/*" element={(<BasicLayoutPages />)} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;
