/**
 * A basic static server for hosting purposes. Can be used to develop, but
 * should opt for using gulp instead as it'll be less annoying to flush out the navigation
 */

const hapi = require('hapi');
const buildPathMap = require('./server/pathbuilder.js');
const processOptions = require('./staticbuilder/processoptions');
const server = new hapi.Server();
server.connection({
    port:3003
});

server.register(require('inert'), (err) => {
   if(err){
       throw err;
   }
});

// read the directory and build construct the appropriate paths
server.app = processOptions();

// build a map of all the routes based on the current site structure.
var pathMap = buildPathMap(server);

// set the routes
server.route(pathMap);

// this serves things from the assets folder
server.route({
    method:'GET',
    path:'/assets/{name*}',
    handler:function(req,reply){
        var file = `${__dirname}/${server.app.projectLocation}/content/assets/${req.params.name}`
        reply.file(file);
    }
});


server.start((err) => {
    if(err){
        throw err;
    }
});

/*

 // set the routes
 server.route(pathMap);

 // this serves things from the assets folder
 server.route({
 method:'GET',
 path:'/content/assets/{name*}',
 handler:function(req,reply){
 var file = `${__dirname}/${server.app.projectLocation}/assets/${req.params.name}`
 reply.file(file);
 }
 });


 server.start((err) => {
 if(err){
 throw err;
 }
 });
 */