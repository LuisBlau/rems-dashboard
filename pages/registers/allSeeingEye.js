import React, {useState} from "react";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper"
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {makeStyles} from "@material-ui/core/styles";
import useSWR from "swr";
import fetcher from "../../lib/fetcherWithHeader";
import OverviewLayout from "../../components/OverviewLayout";
import TextField from "@material-ui/core/TextField";

const drawerWidth = 240;

const selects = [{id: 11, value: 'backup_server_status'},
  {id: 13, value: 'hello'},
  {id: 21, value: 'last_cart_id'},
  {id: 22, value: 'last_correlation_id'},
  {id: 12, value: 'last_reboot'},
  {id: 23, value: 'last_upc'},
  {id: 14, value: 'pinpad_app_version'},
  {id: 16, value: 'pinpad_jpos_version'},
  {id: 6, value: 'pinpad_linedisplay'},
  {id: 18, value: 'pinpad_reboots'},
  {id: 17, value: 'pinpad_resets'},
  {id: 19, value: 'pinpad_shutdowns'},
  {id: 7, value: 'pinpad_sigcap'},
  {id: 9, value: 'pinpad_stage'},
  {id: 20, value: 'pinpad_startups'},
  {id: 15, value: 'pinpad_tellium_version'},
  {id: 8, value: 'pinpad_unit'},
  {id: 10, value: 'primary_server_status'},
  {id: 5, value: 'printer_status'},
  {id: 4, value: 'scale_status'},
  {id: 3, value: 'tender_substate'},
  {id: 2, value: 'item_substate'},
  {id: 1, value: 'ui_state'},
]

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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 100
  }
}));

export default function ConnectionOverview(props) {
  const [termStateText, setTermStateText] = useState('2804-49');
  const [filterId, setFilterId] = React.useState('');


  function _handleKeyDown(e) {
    if (e.key === 'Enter') {
      setTermStateText(e.target.value)
    }
  }

  const classes = useStyles();

  const {data, error} = useSWR(
    `/registers/${termStateText}`,
    fetcher
  );

  if (error) return (
    <OverviewLayout>
      <Grid item xs={8}></Grid>
      <Grid item xs={4}>
        <TextField
          defaultValue={props.filter}
          id="outlined-basic"
          label="SSSS-TT"
          variant="outlined"
          onKeyDown={(e) => _handleKeyDown(e)}
        />
      </Grid>
      <div>error</div>
    </OverviewLayout>)
  if (!data || typeof data == 'undefined') return (<OverviewLayout>
    <Grid item xs={8}></Grid>
    <Grid item xs={4}>
      <TextField
        defaultValue={props.filter}
        id="outlined-basic"
        label="SSSS-TT"
        variant="outlined"
        onKeyDown={(e) => _handleKeyDown(e)}
      />
    </Grid>
    <div>loading...</div>
  </OverviewLayout>)

  return (
    <OverviewLayout>
      <Grid item xs={4}></Grid>
      <Grid item xs={4}>
        <FormControl className={classes.formControl}>
          <InputLabel>Property</InputLabel>
          <Select
            value={filterId}
            onChange={ (e) => setFilterId(e.target.value)}
          >
            {selects.map((select) => (
              <MenuItem key={select.id} value={select.id}>
                {select.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={4}>
        <TextField
          defaultValue={props.filter}
          id="outlined-basic"
          label="Terminal (SSSS-TT)"
          variant="outlined"
          onKeyDown={(e) => _handleKeyDown(e)}
        />
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Property Name</TableCell>
                <TableCell align="right">Property Value</TableCell>
                <TableCell align="right">Logtime</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data['rows']
                .filter((controller) => (controller.property_id === filterId) || filterId === '')
                .sort(({property_id: prev_id}, {property_id: cur_id}) => prev_id - cur_id)
                .map((controller) => (
                  <TableRow key={controller.property_id + controller.logtime}>
                    <TableCell component="th" scope="row">
                      {controller.property_name}
                    </TableCell>
                    <TableCell align="right">{controller.property_value}</TableCell>
                    <TableCell align="right">{controller.logtime}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </OverviewLayout>

  );
}

ConnectionOverview.defaultProps = {
  filter: ""
}
