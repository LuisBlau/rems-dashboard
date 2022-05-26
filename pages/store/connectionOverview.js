import useSWR from "swr";
import { styled } from '@mui/material/styles';
import fetcher from "../../lib/lib";
import React, { useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Copyright from "../../src/Copyright";
import OverviewStorePaper from "../../components/Connection/OverviewStorePaper";
import TextField from "@mui/material/TextField";
const PREFIX = 'connectionOverview';
import Typography from '@mui/material/Typography';

const classes = {
  content: `${PREFIX}-content`,
  container: `${PREFIX}-container`,
  appBarSpacer: `${PREFIX}-appBarSpacer`,
  paper: `${PREFIX}-paper`,
  fixedHeight: `${PREFIX}-fixedHeight`
};

const Root = styled('main')((
  {
    theme
  }
) => ({
  [`&.${classes.content}`]: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },

  [`& .${classes.container}`]: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },

  [`& .${classes.appBarSpacer}`]: {
  paddingTop: 80
},
  [`& .${classes.paper}`]: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },

  [`& .${classes.fixedHeight}`]: {
    height: 240,
  }
}));

const drawerWidth = 240;

export default function ConnectionOverview() {


  const [filterText, setFilterText] = useState("");

  const { data, error } = useSWR(
    "/REMS/stores",
    fetcher
  );
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <Root className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Typography align="center" variant="h4">Enterprise Overview</Typography>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={8} />
          <Grid item xs={4}>
            <TextField
              id="outlined-basic"
              label="Filter"
              variant="outlined"
              onChange={(event) => setFilterText(event.target.value)}
            />
          </Grid>
          {data
            .filter((store) =>
              (store.storeName ).includes(filterText.toLowerCase())
            )
            .map((store) => (
              <Grid item xs={12}>
                <Paper className={classes.paper} sx={{backgroundColor:'#dbe2e7'}}>
                  <OverviewStorePaper data={store} />
                </Paper>
              </Grid>
            ))}
        </Grid>
        <Box pt={4}>
          <Copyright />
        </Box>
      </Container>
    </Root>
  );
}
