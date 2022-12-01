import { AppBar, Box, Button, Container, Toolbar, Typography, useTheme } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import BuildingPermit from './components/building-permit/BuildingPermit';
import UnEmployment from './components/unEmployment-Poverty/UnEmployment';
import CCVI from './components/CCVI';
import TaxiTrips from './components/TaxiTrips';
import Covid19 from './components/covid19';
import Covid19Zip from './components/Covid19Zip';
import LeftNav from './components/LeftNav';
import DashBoard from './components/home/home';
import * as React from 'react';
import SignIn from './components/user/signin';

function App () {
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const theme = useTheme();

  return (
    <div style={{ margin: theme.spacing(-1) }}>
      <BrowserRouter>
        <Box sx={{ display: 'flex' }}>
          <LeftNav open={open} toggleDrawer={toggleDrawer} />
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: '100vh',
              overflow: 'auto'
            }}
          >
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6" component="div" color = "success" sx={{ flexGrow: 1 }}>
                Chicago Business Intelligence
                </Typography>
                <Button color="inherit" href = "/signIn">Login</Button>
              </Toolbar>
            </AppBar>

            <Container sx={{ mt: 2 }}>
              <Routes>
                <Route path="/" element={<DashBoard />}></Route>
                <Route path="/signIn" element={<SignIn/>}></Route>
                <Route path="/buildingPermit" element={<BuildingPermit />}></Route>
                <Route path="/unEmployment" element={<UnEmployment />}></Route>
                <Route path="/ccvi" element={<CCVI />}></Route>
                <Route path="/taxiTrips" element={<TaxiTrips />}></Route>
                <Route path="/covid19" element={<Covid19 />}></Route>
                <Route path="/covid19Zip" element={<Covid19Zip />}></Route>
              </Routes>
            </Container>
          </Box>
        </Box>
      </BrowserRouter>
    </div>
  );
}

export default App;
