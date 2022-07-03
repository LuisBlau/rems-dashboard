const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
var port = 443;
var httpPort = 80;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
    key: fs.readFileSync("./default.key"),
    cert: fs.readFileSync("./default.crt")
};

const httpServer = require("http")

const httpOptions = {
};

// for development
if ( process.env.RMA_DEV == "true") {
    console.log("It's a dev box - server")
    port=2999
    httpPort=3000
}


app.prepare().then(() => {
    createServer(httpsOptions, (req, res) => {
		console.log(req.url)
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    }).listen(port, (err) => {
        if (err) throw err;
        console.log("ready - started server on port" + port);
    });
	
	httpServer.createServer(httpOptions, (req,res) => {
		console.log(req.url)
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    }).listen(httpPort, (err) => {
        if (err) throw err;
        console.log("ready - started server on port" + httpPort);
    });
});

