import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
// import { white } from '@mui/material/colors';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import NoBackpackIcon from '@mui/icons-material/NoBackpack';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import UpdateIcon from '@mui/icons-material/Update';
import PeopleIcon from '@mui/icons-material/People';
// import AssignmentIcon from '@mui/icons-material/Assignment';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';

export const mainListItems = (
  <React.Fragment>
    <ListItemButton href='/buildingPermit'>
      <ListItemIcon>
        <DomainAddIcon sx= {{ px: [1], color: 'white' }}/>
      </ListItemIcon>
      <ListItemText primary="Building Permits" />
    </ListItemButton>
    <ListItemButton href='/unEmployment'>
      <ListItemIcon>
        <NoBackpackIcon sx= {{ px: [1], color: 'white' }}/>
      </ListItemIcon>
      <ListItemText primary="UnEmployment" />
    </ListItemButton>
    <ListItemButton href='/ccvi'>
      <ListItemIcon>
        <PeopleIcon sx= {{ px: [1], color: 'white' }}/>
      </ListItemIcon>
      <ListItemText primary="Communities" />
    </ListItemButton>
    <ListItemButton href='/taxiTrips'>
      <ListItemIcon>
        <LocalTaxiIcon sx= {{ px: [1], color: 'white' }}/>
      </ListItemIcon>
      <ListItemText primary="Taxi Trips" />
    </ListItemButton>
    <ListItemButton href='/covid19'>
      <ListItemIcon>
        <CoronavirusIcon sx= {{ px: [1], color: 'white' }}/>
      </ListItemIcon>
      <ListItemText primary="Covid-19-Total" />
    </ListItemButton>
    <ListItemButton href='/covid19Zip'>
      <ListItemIcon>
        <UpdateIcon sx= {{ px: [1], color: 'white' }}/>
      </ListItemIcon>
      <ListItemText primary="Covid-19-Zip" />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
    </ListSubheader>
  </React.Fragment>
);
