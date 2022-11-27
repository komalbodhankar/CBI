import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import BadgeIcon from '@mui/icons-material/Badge';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';

export const mainListItems = (
  <React.Fragment>
    <ListItemButton href='/buildingPermit'>
      <ListItemIcon>
        <DomainAddIcon />
      </ListItemIcon>
      <ListItemText primary="Building Permits" />
    </ListItemButton>
    <ListItemButton href='/unEmployment'>
      <ListItemIcon>
        <BadgeIcon />
      </ListItemIcon>
      <ListItemText primary="UnEmployment" />
    </ListItemButton>
    <ListItemButton href='/ccvi'>
      <ListItemIcon>
        <CoronavirusIcon />
      </ListItemIcon>
      <ListItemText primary="CCVI" />
    </ListItemButton>
    <ListItemButton href='/taxiTrips'>
      <ListItemIcon>
        <LocalTaxiIcon />
      </ListItemIcon>
      <ListItemText primary="Taxi Trips" />
    </ListItemButton>
    <ListItemButton href='/covid19'>
      <ListItemIcon>
        <CoronavirusIcon />
      </ListItemIcon>
      <ListItemText primary="Covid-19-Total" />
    </ListItemButton>
    <ListItemButton href='/covid19Zip'>
      <ListItemIcon>
        <CoronavirusIcon />
      </ListItemIcon>
      <ListItemText primary="Covid-19-Zip" />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Saved reports
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItemButton>
  </React.Fragment>
);
