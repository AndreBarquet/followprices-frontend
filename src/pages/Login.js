import React, { useState } from 'react';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';

import {
  Container,
  Snackbar,
  Typography,
  Box,
  Grid,
  Link,
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Alert,
} from '@mui/material';

import { useDispatch } from 'react-redux';
import { setCurrentuser, userLogin } from "../model/currentUserStore";
import config from '../app/config';
import { exists } from "../utils/utils";


const theme = createTheme();

export default function Login() {
  const [loginParams, setLoginParams] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const history = useNavigate();

  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
  const [snackbarErrorMessage, setSnackbarErrorMessage] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const payload = loginParams;
    localStorage.clear();

    const callback = (response) => {
      if (exists(response?.error)) {
        setSnackbarErrorMessage(response?.error);
        setShowErrorSnackbar(true);
        return;
      }

      const loggedUserInfo = { name: response?.name, email: response?.email };

      localStorage.setItem("name", loggedUserInfo?.name);
      localStorage.setItem("email", loggedUserInfo?.email);
      localStorage.setItem("googleLogin", false);

      dispatch(setCurrentuser({ payload: loggedUserInfo }))
      history('/inicio');
    };

    dispatch(userLogin({ payload, callback }))

  };

  function loginGoogleSuccess(response) {
    const loggedUserInfo = {
      firstName: response?.profileObj?.givenName,
      lastName: response?.profileObj?.familyName,
      name: response?.profileObj?.name,
      email: response?.profileObj?.email,
      avatar: response?.profileObj?.imageUrl,
    };

    localStorage.setItem("firstName", loggedUserInfo?.firstName);
    localStorage.setItem("lastName", loggedUserInfo?.lastName);
    localStorage.setItem("name", loggedUserInfo?.name);
    localStorage.setItem("email", loggedUserInfo?.email);
    localStorage.setItem("avatar", loggedUserInfo?.avatar);
    localStorage.setItem("googleLogin", true);

    dispatch(setCurrentuser({ payload: loggedUserInfo }))
    history('/inicio');
  }

  function loginGoogleError(response) {
    setSnackbarErrorMessage('Ocorreu um erro ao realizar o login com o Google');
    setShowErrorSnackbar(true);
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">Entrar no sistema</Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={loginParams?.email}
              onChange={e => setLoginParams({ ...loginParams, email: e?.target?.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              value={loginParams?.password}
              onChange={e => setLoginParams({ ...loginParams, password: e?.target?.value })}
            />
            {/* <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" /> */}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Login</Button>
            {/* <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">Esqueceu a senha?</Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">Don't have an account? Sign up</Link>
              </Grid>
            </Grid> */}
            <Grid container style={{ marginTop: 5, textAlign: 'center' }}>
              <Grid item xs>
                <p style={{ margin: 0 }}>ou</p>
              </Grid>
            </Grid>
            <Grid container style={{ marginTop: 10, textAlign: 'center' }}>
              <Grid item xs>
                <GoogleLogin
                  clientId={config?.googleAuthClientId}
                  buttonText="Entre com o Google"
                  onSuccess={loginGoogleSuccess}
                  onFailure={loginGoogleError}
                  cookiePolicy={'single_host_origin'}
                />
              </Grid>
            </Grid>
          </Box>
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={showErrorSnackbar}
            autoHideDuration={6000}
            onClose={() => setShowErrorSnackbar(false)}
          >
            <Alert onClose={() => setShowErrorSnackbar(false)} severity="error" sx={{ width: '100%' }}>
              {snackbarErrorMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Container>
    </ThemeProvider>
  );
};