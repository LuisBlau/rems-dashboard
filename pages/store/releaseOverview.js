import useSWR from "swr";
import fetcher from "../../lib/lib";
import React, {useState} from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Copyright from "../../src/Copyright";
import OverviewReleasePaper from "../../components/Release/OverviewReleasePaper";
import TextField from "@mui/material/TextField";
import { makeStyles } from '@mui/styles';

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

export default function releaseOverview() {
  const classes = useStyles();

  const [filterText, setFilterText] = useState("");

  const {data, error} = useSWR("/REMS/release", fetcher);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer}/>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={8}/>
          <Grid item xs={4}>
            <TextField
              id="outlined-basic"
              label="Filter"
              variant="outlined"
              onChange={(event) => setFilterText(event.target.value)}
            />
          </Grid>
          {data.controllers
            .filter((store) => store.store_number.includes(filterText))
            .map((store) => (
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <OverviewReleasePaper data={store}/>
                </Paper>
              </Grid>
            ))}
        </Grid>
        <Box pt={4}>
          <Copyright/>
        </Box>
      </Container>
    </main>
  );
}
