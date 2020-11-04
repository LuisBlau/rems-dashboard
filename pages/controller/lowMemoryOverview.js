import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core/styles";
import useSWR from "swr";
import fetcher from "../../lib/lib.js";
import LowMemoryPaper from "../../components/Memory/LowMemoryPaper";
import OverviewLayout from "../../components/OverviewLayout";
import TextField from "@material-ui/core/TextField";

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
}));

export default function ConnectionOverview(props) {

  const classes = useStyles();
  const [filterText, setFilterText] = useState(props.filter);


  const {data, error} = useSWR(
    "/REMS/low-mem",
    fetcher
  );
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
  <OverviewLayout>
    <Grid item xs={8}/>
    <Grid item xs={4}>
      <TextField
        defaultValue={props.filter}
        id="outlined-basic"
        label="Filter"
        variant="outlined"
        onChange={(event) => setFilterText(event.target.value)}
      />
    </Grid>
    { data.filter((controller) =>
        Object.keys(controller)[0].includes(filterText.toLowerCase())
      ).map((controller) => (
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <LowMemoryPaper data={controller}/>
          </Paper>
        </Grid>
      ))
    }
  </OverviewLayout>

  );
}

ConnectionOverview.defaultProps = {
  filter: ""
}