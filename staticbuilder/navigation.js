var fs = require('fs');

// responsible for generating navigation to all of the pages on the site.
module.exports = function(){

    const path = __dirname + "/../site"
    const BASE_PATH = path;
    // the directories that don't contain any content files or files that are core
    const excluded = [
        "layouts",
        "assets",
        "index.html"
    ]

// read the directory and filter based on the excluded variable above
    var content = fs.readdirSync(path,"utf8");
    content = content.filter((page) => {
        var fn = excluded.indexOf(page);
        if(fn === -1){
            return page;
        }
    });

// read the directories of all the files that contain content, match it up with it's layouts
// file(the name of which is determined by it's folder name) and compile
    content = content.map((obj) => {

        // loop through grab all the pages in the current directory of the loop
        var pages = fs.readdirSync(`${BASE_PATH}/${obj}`,'utf8');
        var pagePath = `/${obj}/`;

        if(pagePath.search("pages") !== -1){
            pagePath = "/";
        }

        var linkInfo = {};

        pages = pages.map(page => {
            return {
                name:page.split(".")[0],
                path:pagePath + page
            }
        });

        return pages[0];
    });



    return content;

}