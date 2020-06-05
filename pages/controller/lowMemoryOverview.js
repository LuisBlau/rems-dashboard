import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Copyright from "../../src/Copyright";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import useSWR from "swr";
import fetcher from "../../lib/lib.js";
import OverviewStorePaper from "../../components/Connection/OverviewStorePaper";
import TextField from "@material-ui/core/TextField";
import LowMemoryPaper from "../../components/Memory/LowMemoryPaper";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  appBarSpacer: theme.mixins.toolbar,
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
    "/low-mem",
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
            .filter((controller) =>
              Object.keys(controller)[0].includes(filterText.toLowerCase())
            ).map((controller) => (
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <LowMemoryPaper data={controller} />
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