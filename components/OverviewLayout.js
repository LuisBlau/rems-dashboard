import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Copyright from "../src/Copyright";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";

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
}));

export default function OverviewLayout(props) {
  const classes = useStyles();
  return(
    <main className={classes.content}>
      <div className={classes.appBarSpacer}/>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>

          {props.children}
        </Grid>
        <Box pt={4}>
          <Copyright/>
        </Box>
      </Container>
    </main>
  )
}