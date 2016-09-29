var http = require('http');
var stacked = require('stacked');
var serveStatic = require('serve-static');
var finalHandler = require('finalhandler');
var chokidar = require('chokidar');
const bole = require('bole');
const log = require('bole')('server');
const liveReload = require('./server/inject')
const garnish = require('garnish');
const WebSocketServer = require('ws').Server;
const optionsProcessor = require('./staticbuilder/processoptions')
const compileSite = require('./servercompiler');


//============ SETUP ================
var pretty = garnish({
    level:'info',
    name:'spackle'
})
pretty.pipe(process.stdout);
bole.output({
    level:'info',
    stream:pretty
});
// port
const PORT = 3002;

var wss = new WebSocketServer({port:3001});

var options = optionsProcessor();
//============ SERVER ================
var app = stacked();
app.use(liveReload());

var dst = options.destinationLocation.replace("../","./");
// set up serve func
var serve = serveStatic(dst,{
    index:['index.html']
});

app.use(serve);

var server = http.createServer(app);
server.listen(PORT,function(){
    log.info(`Server started, listening on port ${PORT}`);
});

//============ FILE WATCHING ================

var socket = null;
wss.on('connection',function connection(ws){
    socket = ws;
});


var watcher = chokidar.watch("./" + options.projectLocation);
watcher.on('change',(path) => {

    compileSite();
    log.info("file changed - " + path);

    if(socket !== null){
        socket.send("reload")
    }
})

watcher.on('error',error => {
    console.log(error);
})