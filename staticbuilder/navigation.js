var fs = require('fs');
var hogan = require('hogan.js');
var formatTitle = require('../staticbuilder/titleformater')

// data for the home page
var homepageData = {};

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

        // lastly, load the config file that may be present
        // so we can get the site name if specified.
        var isIndex = false;
        var config = require(`../${options.projectFullPath}/config.js`);
        if(name === "Index"){
            isIndex = true;
            name = config.siteName !== undefined ? config.siteName : "Home";
        }
        return {
            name:name,
            isIndex:isIndex,
            path:pagePath[0]
        }
    });

    // TODO make sure home is the first item in the list
    var orderedPathData = [];

    var home = pathData.filter((value,index) => {
        if(value.isIndex){
            return Object.assign(value,{index:index})
        }
    });


    // splice home from the current navigation set
    var p = pathData.splice(home[0].index,1);
    orderedPathData.push(p[0]);
    pathData.forEach(obj => {
        orderedPathData.push(obj);
    })



    // compile the urls with the layout
    layout = hogan.compile(layout).render({
        homepage:p[0],
        pages:pathData,
        fullnavigation:orderedPathData
    });

    return layout;
}