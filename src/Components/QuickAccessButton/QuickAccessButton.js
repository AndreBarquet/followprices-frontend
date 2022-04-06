import React from 'react';

import SpeedDial from '@mui/material/SpeedDial';
import { useNavigate } from 'react-router-dom';

// Icons
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { Save, Print, Share, Dvr, BookmarkAdd, Close } from '@mui/icons-material';
import { notExists } from '../../utils/utils';

const actions = [
  { icon: <Dvr />, name: 'Tipo', path: '/tipos' },
  { icon: <Save />, name: 'Save' },
  { icon: <Print />, name: 'Print' },
  { icon: <Share />, name: 'Share' },
];
const QuickAccessButton = props => {
  const history = useNavigate();

  const redirect = (path) => {
    if (notExists(path)) return;
    history(path);
  }

  return (
    <SpeedDial ariaLabel="Acesso rapido" sx={{ position: 'absolute', bottom: 30, right: 40 }} icon={<SpeedDialIcon icon={<BookmarkAdd />} openIcon={<Close />} />}>
      {actions.map((action) => (
        <SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} tooltipOpen onClick={() => redirect(action?.path)} />
      ))}
    </SpeedDial>
  );
}

export default QuickAccessButton;
