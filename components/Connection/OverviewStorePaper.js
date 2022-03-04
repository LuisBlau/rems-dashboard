import { Button, Grid, LinearProgress, Typography } from "@mui/material";
import React from "react";
import Link from "@mui/material/Link";
import {splunkLinker, registerStatusLinker, storeLinker}from "../../lib/links"
import { makeStyles } from '@mui/styles';

// splunk link https://cpc-logsearch02.prod.us.walmart.net/en-US/app/check-out-with-mewebpos/search?display.page.search.mode=smart&dispatch.sample_ratio=1&q=search%20index%3D%22wcnp_cpc%22%20log.clientApp%3DKIOSK%20log.enterpriseId%3D%22prod%22%20log.tagName%3DCLIENT_INITIALIZATION%20log.storeId%3D{props.data.store_num}%20log.clientApp%3DKIOSK%20%20log.countryCode%3D{props.data.country}%20log.registerNbr%3D*%20log.registerType%3DkioskBridge%20log.message.cartHasItems%3D*%20time%3D*%20%7C%20stats%20%20count%20by%20log.countryCode%2C%20log.storeId%2C%20log.registerNbr%2C%20log.registerType%2C%20log.message.cartHasItems%2C%20time%20%20%7C%20streamstats%20%20count%20as%20%22%20%22%20%20%7C%20table%20%20%22%20%22%2C%20log.countryCode%2C%20log.storeId%2C%20log.registerNbr%2C%20log.registerType%2C%20log.message.cartHasItems%2C%20time&earliest=-1w&latest=now&display.page.search.tab=statistics&display.general.type=statistics&sid=1588275671.2401163_F9FCF295-CD24-43DE-A61A-7BF4055B56AA
// store link https://cpp.s00001.us.wal-mart.com:8443/
// register status placeholder http://wmpos2/html/register-status.html?store=0001

export default function OverviewStorePaper(props) {
  const classes = makeStyles((theme) => ({
    barHeight: {
      height: 50
    },
  }));

  const downloadTxtFile = () => {
    const element = document.createElement("a");
    const file = new Blob(["\"C:\\Program Files\\Putty\\putty.exe\" -load \"wm-pos\" -ssh cpp.s0"+props.data.store_num+"."+props.data.country], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "connect.bat";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  const splunk_link = splunkLinker(props.data.store_num, props.data.country)
  const store_link = storeLinker(props.data.store_num,props.data.country.toLowerCase())
  const register_link = registerStatusLinker(props.data.store_num)
  const total_registers = props.data.connected + props.data.disconnected;
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Link href={store_link}><Typography variant="h5">{props.data.store_num}.{props.data.country}</Typography></Link>
      </Grid>
      <Grid item xs={4}>
        <Typography>Online Registers: {props.data.connected} of {total_registers}</Typography>
      </Grid>
      <Grid className={classes.barHeight} item xs={8}>
        <ColoredProgressBar percent={(props.data.connected / total_registers) * 100}/>
      </Grid>
      <Grid item xs={9}>
        <Typography>Last Check: {props.data.last_updated}</Typography>
      </Grid>
      <Grid item xs={3}>
        <Button variant={"outlined"} type={"reset"} onClick={downloadTxtFile}>Putty</Button>
      </Grid>
      <Buttons
        splunk={splunk_link}
        register={register_link}
        store={store_link}
      />
    </Grid>
  );
}

function ColoredProgressBar(props) {
  const styles = makeStyles((theme) => ({
    progress: {
      height: 50,
      colorSecondary: "#D6556C",
      dashedColorSecondary: "#D6556C",
      barColorSecondary: "#D6556C",
    },
  }));
  const color = props.percent > 50 ? "primary" : "secondary";
  return (
    <LinearProgress
      height={100}
      style={styles.progress}
      variant={"determinate"}
      value={props.percent}
      color={color}
    />
  );
}

function Buttons(props) {
  return (
    <React.Fragment>
      <Grid item xs={4}>
        <Link target={"_blank"} href={props.splunk}>
          <Button variant="contained" size="large">
            Splunk Search
          </Button>
        </Link>
      </Grid>
      <Grid item xs={4}>
        <Link target={"_blank"} href={props.store}>
          <Button variant="contained" size="large">
            Store Status
          </Button>
        </Link>
      </Grid>
      <Grid item xs={4}>
        <Link target={"_blank"} href={props.register}>
          <Button variant="contained" size="large">
            Register Status
          </Button>
        </Link>
      </Grid>
    </React.Fragment>
  );
}
