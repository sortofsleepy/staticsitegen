var fs = require('fs');
var hogan = require('hogan.js');
var formatTitle = require('../staticbuilder/titleformater')

// compiles navigation template
module.exports = function(contentData,options){
    options.navLayout = options.navLayout !== undefined ? options.navLayout : "nav.html";

    // load the navigation template
    var layoutPath = `../${options.projectFullPath}/layouts/${options.navLayout}`
    var layout = fs.readFileSync(layoutPath,'utf8');

    // build all of the urls for the site
    var pathData = contentData.map(data => {
        var pagePath = `${data.path}/${data.name}`;

        // remove the "content" and the filename of each path
        pagePath = pagePath.replace("content", "");
        pagePath = pagePath.split(".");

        if (pagePath[0].search("/index") !== -1) {
            pagePath[0] = "/"
        }

        if (pagePath[0].search("/pages") !== -1) {
            pagePath[0] = pagePath[0].replace("/pages", "")
        }

        // make sure the names look a bit nicer
        // if index - make sure name is home
        var name = formatTitle(data.name);
        if(name === "Index"){
            name = "Home";
        }

        return {
            name:name,
            path:pagePath[0]
        }
    });

    // compile the urls with the layout
    layout = hogan.compile(layout).render({
        navigation:pathData
    });

    return layout;
}