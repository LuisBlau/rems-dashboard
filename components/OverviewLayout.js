import Container from "@mui/material/Container";
import { styled } from '@mui/material/styles';
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Copyright from "../src/Copyright";
import React from "react";
const PREFIX = 'OverviewLayout';

const classes = {
  content: `${PREFIX}-content`,
  container: `${PREFIX}-container`
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
  }
}));

export default function OverviewLayout(props) {

  return (
    <Root className={classes.content}>
      <div className={classes.appBarSpacer}/>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>

          {props.children}
        </Grid>
        <Box pt={4}>
          <Copyright/>
        </Box>
      </Container>
    </Root>
  );
}