import {Grid, Typography} from "@mui/material";
import { styled } from '@mui/material/styles';
import React from "react";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
const PREFIX = 'VpdPaper';

const classes = {
  light: `${PREFIX}-light`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.light}`]: {
    color: "rgb(0, 0, 0, 0.3)"
  }
}));

export default function VpdPaper(props) {

  return (
    <Grid container spacing={1}>
      <Grid item xs={4}>
        <Typography align={"right"} variant="h5">
          {props.data["store"]
          + "-"
          + props.data["register"]}.{props.data["country"]}
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography className={classes.light} variant="overline" align={"left"}>
          Last Updated: {props.data["last_update"]}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <InfoTable data={props.data}/>
      </Grid>
    </Grid>
  );
}

export function InfoTable(props) {
  return (
    <Root><Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Bios</TableCell>
          <TableCell>Model</TableCell>
          <TableCell>SCO</TableCell>
          <TableCell>SERIAL</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>{props.data["bios_ver"]}</TableCell>
          <TableCell>{props.data["model"]}</TableCell>
          <TableCell>{props.data["sco_type"]}</TableCell>
          <TableCell>{props.data["serial_no"]}</TableCell>
        </TableRow>
      </TableBody>
    </Table></Root>
  );
}