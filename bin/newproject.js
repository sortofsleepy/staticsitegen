#!/usr/bin/env node
const argv = require('minimist')(process.argv.slice(2));
const ncp = require('ncp');

// TODO test to see if this works
var PROJECT_NAME = "";
var PROJECT_LOCATION = ""

if(!argv.hasOwnProperty('location')){
    PROJECT_LOCATION = __dirname;
}

if(!argv.hasOwnProperty('name')){
    PROJECT_NAME = "Spackle";
}
// copy sample project folder and files to specified location
ncp('./sample_project',PROJECT_LOCATION,(err) => {
    if(err){
        console.error(err);
    }else{
        // rename the folder from sample_project to new project name
        fs.renameSync(`${PROJECT_LOCATION}/sample_project`,`${PROJECT_LOCATION}/${PROJECT_NAME}`);
        console.log("created successfully!")
    }
})