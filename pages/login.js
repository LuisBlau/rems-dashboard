import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { styled } from '@mui/material/styles';
import Container from "@mui/material/Container";
import React, { useEffect, useState } from "react";
import axios from "axios"

const PREFIX = 'login';

const classes = {
    content: `${PREFIX}-content`,
    appBarSpacer: `${PREFIX}-appBarSpacer`,
    container: `${PREFIX}-container`,
    paper: `${PREFIX}-paper`,
    fixedHeight: `${PREFIX}-fixedHeight`
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
    },

    [`& .${classes.appBarSpacer}`]: {
        paddingTop: 50
    },

    [`& .${classes.paper}`]: {
        padding: theme.spacing(2),
        display: "flex",
        overflow: "auto",
        flexDirection: "column",
    },

    [`& .${classes.fixedHeight}`]: {
        height: 240,
    }
}));

export default function Login() {
	
	const [username,setUsername] = useState("")
	const [password,setPassword] = useState("")
	const [message,setMessage] = useState(null)
	const updatePassword = (e) => setPassword(e.target.value)
	const updateUsername = (e) => setUsername(e.target.value)
	const login = () => {
		axios.get("/api/auth/login?username=" + username + "&password=" + password).then((res) => {
			window.location.replace("/deployStatus")
		}).catch((err) => {
			setMessage("invalid Username Or Password")
		})
	}
	return(
      <Root className={classes.content}>
        <div className={classes.appBarSpacer}/>
          <Container maxWidth="lg" className={classes.container} style={{margin:100,float:"left"}}>
		  <div>
		<TextField label="Username" value={username} onChange={updateUsername} style={{display:"block"}}/>
		<TextField label="Password" type="password" value={password} onChange={updatePassword} style={{display:"block"}}/>
		<Button onClick={login} style={{display:"block"}} variant="contained">Login</Button>
		</div>
		</Container>
        </Root>
	)
}