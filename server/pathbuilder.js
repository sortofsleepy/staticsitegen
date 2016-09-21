const fs = require('fs');
const pageHandler = require('./pagehandler');
const determineLayout = require('../staticbuilder/layouts');

/**
 * This reads the current project structure and assembles all the necessary paths
 * @param server
 * @returns {Array}
 */
module.exports = function(server){
    var paths = [];
    var options = server.app;
    var path = options.projectLocation
    var BASE_PATH = path;
    // see where the project directory is
    if(!options.hasOwnProperty('projectLocation')){
        console.error("Project directory is not known, please restart and run with the the flag --project <path to project>")
    }else{
        var base_name = options.projectLocation;
        // the directories that don't contain any content files or files that are core
        const excluded = [
            "layouts",
            "assets",
            "index.html"
        ]

        // read the directory and filter based on the excluded variable above
        var content = fs.readdirSync(path + "/content","utf8");
        content = content.filter((page) => {
            var fn = excluded.indexOf(page);
            if(fn === -1){
                return page;
            }
        });


// read the directories of all the files that contain content, match it up with it's layouts
// file(the name of which is determined by it's folder name) and compile
        content = content.map((obj) => {
            // get the layout file name
            var layout = determineLayout(BASE_PATH, obj);

            var pagePath = `${BASE_PATH}/${obj}/`;
            pagePath = pagePath.replace(base_name,"");

            if(pagePath.search("pages") !== -1){
                pagePath = "/{pagename?}"
            }else{
                pagePath = `${pagePath}{pagename}`;
            }

            paths.push({
                config:{
                    description:"hello"
                },
                method:'GET',
                path:pagePath,
                handler:function(req,reply){
                    pageHandler(req,reply,server.app);
                }
            })
        });



    }
    return paths;
}