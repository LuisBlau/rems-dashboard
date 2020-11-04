import { Grid, Typography } from "@material-ui/core";
import React from "react";
import Title from "../Title";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";

export default function OverviewReleasePaper(props) {
  return (
    <Grid container spacing={1}>
      <Grid item xs={3}>
        <Typography variant="h5">{props.data.store_number}</Typography>
      </Grid>
      <Grid item xs={9}>
        <Typography variant="subtitle1" align={"right"}>
          {props.data.os_version}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <ReleaseTable data={props.data.packages} />
      </Grid>
    </Grid>
  );
}

function ReleaseTable(props) {
  if (props.data == null) return <div>loading</div>
  else return (
    <React.Fragment>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Package Name</TableCell>
            <TableCell>Release</TableCell>
            <TableCell>Base</TableCell>
            <TableCell>Version</TableCell>
            <TableCell>CD</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(props.data).map((key) => (
            <TableRow>
              <TableCell>{key}</TableCell>
              <TableCell>{props.data[key].Release}</TableCell>
              <TableCell>{props.data[key].Base}</TableCell>
              <TableCell>{props.data[key].Version}</TableCell>
              <TableCell>{props.data[key].CD}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
