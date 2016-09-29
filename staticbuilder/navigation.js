var fs = require('fs');
var h = require('handlebars');
var formatTitle = require('../staticbuilder/titleformater')
var groupSimilar = require('../staticbuilder/groupings.js');

// data for the home page
var homepageData = {};

/**
 * This compiles a navigation layout based on the current content for the site.
 * @param contentData a object containing a map of all of the avaialble content for the site. See staticbuild/parsecontent.js to see what
 * the object looks like
 * @param options any project options for the build.
 * @param isStaticBuild a flag to indicate whether or not this is a static build or not. If it is, we make sure to append a "index.html" to the end
 * of each url.
 * @returns {*} a compiled handlebars template
 */
module.exports = function(contentData,options,isStaticBuild){
    options.navLayout = options.navLayout !== undefined ? options.navLayout : "nav.html";
    var config = require(`../${options.projectFullPath}/config.js`);
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
        var isHome = false;

        if(name === "Index"){
            isIndex = true;
            isHome = true;
            name = config.siteName !== undefined ? config.siteName : "Home";
        }
        return {
            name:name,
            isHome:isHome,
            isIndex:isIndex,
            path:isStaticBuild === true ? `${pagePath[0]}.html` : pagePath[0]
        }
    });

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

    //TODO Possible todo item - order paths by similarity
    // map out all of the possibilities
    var groups = groupSimilar(orderedPathData);

    var finaldata = {
        homepage:p[0],
        pages:pathData,
        fullnavigation:orderedPathData
    };

    groups.forEach(itm => {

        if(itm.hasOwnProperty("groupName")){

            if(finaldata.hasOwnProperty(itm.groupName)){
               finaldata[`${config.navGroupPrefix}${itm.groupName}`].push(itm);
            }else{
                finaldata[`${config.navGroupPrefix}${itm.groupName}`] = [];
                finaldata[`${config.navGroupPrefix}${itm.groupName}`].push(itm);
            }

        }
    });

    // compile the urls with the layout
    layout = h.compile(layout)(finaldata);

    return layout;
}