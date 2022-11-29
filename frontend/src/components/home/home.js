import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Covid19 from '../../images/covid.jpeg';
import TaxiTrips from '../../images/taxi.jpeg';
import Buildings from '../../images/buildings.jpeg';
import Loan from '../../images/loan.jpeg';
import Traffic from '../../images/traffic.jpeg';
import React from 'react';

const DashBoard = () => {
  const cards = [
    {
      header: 'Covid-19 Reports',
      info: 'The CBI reports are geared towards tracking the current spread of Covid-19 and' + ' ' +
          'their impacts on businesses in different neighbourhoods of the City of Chicago.' + ' ' +
          'These reports will be used to send alerts to taxi drivers of Chicago' +
          ' ' + 'driving in different regions of Chicago, helping drivers to be cautious of' +
          ' the increased exposure of Covid-19 in their pick-up and drop-off locations.' +
          ' For this report, we will use taxi trips and daily COVID-19 datasets for the city of Chicago.',
      image: Covid19
    },
    {
      header: 'Taxi Trips Reports',
      info: 'There are two major airports within the city of Chicago:' +
          ' O’Hare and Midway. The CBI reports track all the trips going from these airports ' +
          'to the different zip codes. Additionally, we track the areas which have HIGH, MEDIUM, and LOW Covid-19 exposures using Heatmaps.' +
          ' This way the City of Chicago can effectively track the spread of Covid-19 caused due to these taxi-trips',
      image: TaxiTrips
    },
    {
      header: 'Traffic Patterns Forecast',
      info: 'For streetscaping investment and planning, the city of' +
          'Chicago is interested to forecast daily, weekly, and monthly traffic patterns' +
          'utilizing the taxi trips for the different zip codes.',
      image: Traffic
    },
    {
      header: 'Building Investments',
      info: 'For industrial and neighborhood infrastructure investment,' +
          'the City of Chicago is interested to invest in top 5 neighborhoods with' +
          'highest unemployment and poverty rate and waive the fees for' +
          'building permits in those neighborhoods in order to encourage businesses' +
          'to develop and invest in those neighborhoods. Both, building permits and' +
          'unemployment are used for this report.',
      image: Buildings
    },
    {
      header: 'Emergency Business Loans',
      info: 'The “little guys”, small businesses, have trouble' +
          'competing with the big players like Amazon and Walmart for warehouse ' +
          'spaces. To help small business, a new program has been piloted with the ' +
          'name "Illinois Small Business Emergency Loan Fund Delta" to offer small' +
          'businesses low interest loans of up to $250,000 for those applicants with' +
          'PERMIT_TYPE of PERMIT - NEW CONSTRUCTION in the zip code that has the' +
          'lowest count of applications and PER ' +
          'CAPITA INCOME is less than 30,000. Both,' +
          'building permits and unemployment are used for this report.',
      image: Loan
    }
  ];

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="primary.main"
            gutterBottom
          >
                Chicago Business Intelligence
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph>
                Our motive is to provide visual reports for the trending hot-topics of the City of Chicago.
          </Typography>
        </Container>
      </Box>
      <Container sx={{ py: 8 }} maxWidth="md">
        <Grid container spacing={4}>
          {cards.map((card) => (
            <Grid item key={card.header} xs={12} sm={12} md={6}>
              <Card
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <CardMedia
                  component="img"
                  image={card.image}
                  alt="random"
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2" color='primary.main'>
                    {card.header}
                  </Typography>
                  <Typography color='text.secondary'>
                    {card.info}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default DashBoard;
