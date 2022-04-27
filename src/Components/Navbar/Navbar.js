import React, { useState } from 'react';

import { AppBar, Avatar, Box, Drawer, Toolbar, Typography, IconButton, MenuItem, Menu, List, ListItem, ListItemText, ListItemIcon, Button, } from '@mui/material';
import { GoogleLogout } from 'react-google-login';

import MenuIcon from '@mui/icons-material/Menu';

import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from "react-router-dom";
import { exists, notExists } from '../../utils/utils';
import config from '../../app/config';

// Styles
import styled from 'styled-components';

const ItemPage = styled(ListItem)`
  ${props => props?.active && 'background-color: #edf3ff;'}  
`;

const GoogleLogoutBtn = styled(GoogleLogout)`
  color: black !important;
  box-shadow: none !important;
  margin-left: 5px;
`;

const Navbar = props => {
  const { routes } = props;
  const { currentUser } = useSelector((state) => state.currentUser);
  const history = useNavigate();

  const [avatarMenu, setAvatarMenu] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);

  const currentPath = useLocation()?.pathname;
  const currentPageName = exists(routes) && routes.find(currentRoute => currentRoute?.path === currentPath)?.name;

  function redirect(path) {
    if (notExists(path)) return;
    history(path)
  }

  function onLogout() {
    localStorage.clear();
    history("/");
  }

  function handleMenu(event) {
    setAvatarMenu(event.currentTarget);
  };

  const handleClose = () => {
    setAvatarMenu(null);
  };

  const renderPagesList = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={() => setShowDrawer(false)}
      onKeyDown={() => setShowDrawer(false)}
    >
      <List>
        {routes.map(currentPage => !currentPage?.hideInMenu && (
          <ItemPage button key={currentPage?.path} active={currentPage?.name === currentPageName} onClick={() => redirect(currentPage?.path)}>
            <ListItemIcon>{currentPage?.icon}</ListItemIcon>
            <ListItemText primary={currentPage?.name} />
          </ItemPage>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => setShowDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {currentPageName}
          </Typography>
          <div>
            <IconButton onClick={handleMenu} sx={{ p: 0 }}>
              <Avatar alt={currentUser?.name ?? localStorage.getItem("name")} src={currentUser?.avatar ?? localStorage.getItem("avatar")} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={avatarMenu}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(avatarMenu)}
              onClose={handleClose}
            >
              {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem> */}
              {localStorage.getItem("googleLogin") === "true" && <GoogleLogoutBtn clientId={config?.googleAuthClientId} buttonText="Sair" onLogoutSuccess={onLogout} />}
              {localStorage.getItem("googleLogin") === "false" && <MenuItem onClick={onLogout}>Sair</MenuItem>}
            </Menu>
          </div>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={showDrawer} onClose={() => setShowDrawer(false)}>
        {renderPagesList()}
      </Drawer>
    </Box>
  );
}

export default Navbar;
