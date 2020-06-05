import { Grid, Typography } from "@material-ui/core";
import React from "react";
import Title from "../Title";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";

export default function LowMemoryPaper(props) {
  return (
    <Grid container spacing={1}>
      <Grid item xs={3}>
        <Typography variant="h5">{Object.keys(props.data)[0]}</Typography>
      </Grid>
      <Grid item xs={9}>
        <Typography variant="subtitle1" align={"right"}>
          {/*{props.data.os_version}*/}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <DriveTable data={props.data} />
      </Grid>
    </Grid>
  );
}

function DriveTable(props) {
  return (
    <React.Fragment>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Drive Name</TableCell>
            <TableCell>Free Memory</TableCell>
            <TableCell>Total Memory</TableCell>
            <TableCell>% Free</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data[Object.keys(props.data)].map((drive) => (
            <TableRow>
              <TableCell>{drive["drive"]}</TableCell>
              <TableCell>{drive["free_mem"]}</TableCell>
              <TableCell>{drive["total_mem"]}</TableCell>
              <TableCell>{drive["percent_free"]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
