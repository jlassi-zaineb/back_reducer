import dotenv from "dotenv";
import express from "express";
import MasterRouter from "./routers/MasterRouter";
var cors = require('cors');


//Load the environment variables from the .env file

dotenv.config({
    path:'.env'
});

/**
 * Express server application class.
 * @description Will later contain the routing system.
 */

class Server {
    public app = express();
    public router = MasterRouter;
}

// initialize server app
const server = new Server();

//init body config
server.app.use(express.urlencoded({ extended: true }));
server.app.use(express.json());
server.app.use(cors());
server.app.options("*" ,cors());

// make server listen on some port
((port = process.env.APP_PORT || 8000) =>{
    server.app.listen(port, ()=> console.log(`> Listening on port ${port}`));
})();

// init default request : localhost:8000/
server.app.get('/', (req, res)=> {
    res.send('localhost: 8000/')
});

// make server app handel any route starting with '/api'
server.app.use('/api', server.router);

// deploiement
// server.app.use(express.static('build'));

