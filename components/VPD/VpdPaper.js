import {Grid, Typography} from "@material-ui/core";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";

const useStyles = makeStyles((theme) => ({
  light: {
    color: "rgb(0, 0, 0, 0.3)"
  }
}));

export default function VpdPaper(props) {
  const classes = useStyles();
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
    <React.Fragment><Table size="small">
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
    </Table></React.Fragment>
  )
}