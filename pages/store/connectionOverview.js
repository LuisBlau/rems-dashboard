import React, { useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Copyright from "../../src/Copyright";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import useSWR from "swr";
import fetcher from "../../lib/lib.js";
import OverviewStorePaper from "../../components/Connection/OverviewStorePaper";
import TextField from "@mui/material/TextField";
import { makeStyles } from '@mui/styles';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function ConnectionOverview() {
  const classes = useStyles();

  const [filterText, setFilterText] = useState("");

  const { data, error } = useSWR(
    "/REMS/store-connection",
    fetcher
  );
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
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
              (store.store_num + "-" + store.country.toLowerCase()).includes(filterText.toLowerCase())
            )
            .map((store) => (
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <OverviewStorePaper data={store} />
                </Paper>
              </Grid>
            ))}
        </Grid>
        <Box pt={4}>
          <Copyright />
        </Box>
      </Container>
    </main>
  );
}
