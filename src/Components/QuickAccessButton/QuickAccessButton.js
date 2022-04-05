import React from 'react';

import { Box } from '@mui/material';

import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { Save, Print, Share, Dvr } from '@mui/icons-material';

// Styles
import styled from 'styled-components';

const MainContainer = styled.div`
  padding: 10px;
`;

const actions = [
  { icon: <Dvr />, name: 'Tipo' },
  { icon: <Save />, name: 'Save' },
  { icon: <Print />, name: 'Print' },
  { icon: <Share />, name: 'Share' },
];
const QuickAccessButton = props => {
  const firstFunction = () => {

  }

  return (
    <SpeedDial
      ariaLabel="Acesso rapido"
      sx={{ position: 'absolute', bottom: 30, right: 40 }}
      icon={<SpeedDialIcon />}
    >
      {actions.map((action) => (
        <SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} tooltipOpen />
      ))}
    </SpeedDial>
  );
}

export default QuickAccessButton;
