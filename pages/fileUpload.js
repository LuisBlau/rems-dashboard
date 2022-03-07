import React,{Component,useState} from 'react';
import fetcher from "../lib/lib.js";
import Container from "@mui/material/Container";
import UploadGrid from "../components/UploadGrid";
import { makeStyles } from '@mui/styles';


const useStyles = makeStyles((theme) => ({
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
  fixedHeight: {
    height: 240,
  },
}));

export default function Upload(props) {
	const classes = useStyles();
	const [selectedFile,setSelectedFile] = useState(0)
	
	// On file select (from the pop up)
	const onFileChange = event => {
	
	// Update the state
	setSelectedFile(event.target.files[0]);
	
	};
	
	// On file upload (click the upload button)
	const onFileUpload = () => {
	
	// Create an object of formData
	const formData = new FormData();
	
	// Update the formData object
	formData.append(
		"file",
		selectedFile);
	
	// Details of the uploaded file
	console.log(selectedFile);
	
	// Request made to the backend api
	// Send formData object
	const requestOptions = {
        method: 'POST',
		body: formData
    };
    fetch('http://127.0.0.1:3001/REMS/uploadfile', requestOptions).then(response => alert("upload successful"))
	};
	return (
      <main className={classes.content}>
        <div className={classes.appBarSpacer}/>
          <Container maxWidth="lg" className={classes.container}>
            <div>
              <input type="file" onChange={onFileChange}/>
               <button onClick={onFileUpload}>
                 Upload!
               </button>
             </div>
          </Container>
          <UploadGrid/>
        </main>
	);
}