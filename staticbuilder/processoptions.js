const argv = require('minimist')(process.argv.slice(2));
module.exports = function(){
    var projectFolder = "";
    var destinationFolder = "";
    var indexLayout = "";

    // if we don't have the project flag, assume it's a folder called "site" in the same place
    // as the compile script
    if(!argv.hasOwnProperty('project')){
        projectFolder = "site"
    }else{
        projectFolder = argv.project;
    }

    // read where we should output the compiled files. By default, it's a folder called "dist" from
    // wherever the script is run from.
    if(!argv.hasOwnProperty('destination')){
        destinationFolder = "dist"
    }else{
        destinationFolder = argv.destination;
    }

    // read the layout to use for the index page. by default it's default.html
    if(!argv.hasOwnProperty('indexlayout')){
        indexLayout = "default.html"
    }else{
        indexLayout = argv.indexlayout
    }


    return {
        projectLocation:projectFolder,
        destinationLocation:destinationFolder,
        indexlayout:indexLayout
    }
}