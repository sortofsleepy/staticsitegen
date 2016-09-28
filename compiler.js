const fs = require('fs');
const optionsProcessor = require('./staticbuilder/processoptions')
const contentParser = require('./staticbuilder/parsecontent');
const Spackle = require('./staticbuilder/Spackle');

// get options from command line
const options = optionsProcessor();

// setup paths
const DIST_PATH = options.destinationLocation; 
const CONTENT_PATH = "content/pages" 
const PATH_TO_PROJECT = options.projectFullPath;

// change to project directory
process.chdir(PATH_TO_PROJECT);

// parse all the content there
var contentData = contentParser(CONTENT_PATH);

contentData.forEach(data => {

});
