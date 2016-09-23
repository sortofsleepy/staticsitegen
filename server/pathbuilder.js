const fs = require('fs');
const pageHandler = require('./pagehandler');
const contentParser = require('../staticbuilder/parsecontent');
const buildNavigation = require('../staticbuilder/navigation')
/**
 * This reads the current project structure and assembles all the necessary paths
 * @param server
 * @returns {Array}
 */
module.exports = function(server){
    var paths = [];
    var options = server.app;

    // path to where the un-compiled files are
    const CONTENT_PATH = "content"
    const PATH_TO_PROJECT = options.projectFullPath;

    // change into the project folder
    process.chdir(PATH_TO_PROJECT);

    // parse all of the content for the site
    var contentData = contentParser(CONTENT_PATH);

    var paths = [];

    // build navigation
    var navigation = buildNavigation(contentData,options);

    // bundle navigation template into the server state.
    server.app.navigation = navigation

    contentData.forEach(data => {
        const layoutPath = `./layouts/${data.layoutName}`;
        var pagePath = `${data.path}/${data.name}`;

        // remove the "content" and the filename of each path
        pagePath = pagePath.replace("content","");
        pagePath = pagePath.split(".");

        if(pagePath[0].search("/index") !== -1){
            pagePath[0] = "/"
        }

        if(pagePath[0].search("/pages") !== -1){
            pagePath[0] = pagePath[0].replace("/pages","")
        }



        paths.push({
            method:'GET',
            path:pagePath[0],
            handler:function(req,reply){
                pageHandler(req,reply,data,server.app);
            }
        })



    });


    return paths;

}