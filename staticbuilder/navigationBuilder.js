const grouping = require('./groupings')
const r = require('ramda');
const fs = require('fs');
const handlebars = require('handlebars');

module.exports = function (content,options) {
    // load config since we need to figure out what navigation template to use
    var config = JSON.parse(fs.readFileSync('config.json','utf8'));

    // layout file contents for the navigation
    var layout = fs.readFileSync(`layouts/${config.navTemplate}`,'utf8')

    // object for holding all the links
    var alllinks = [];

    // array for grouped links
    var grouplinks = {}

    // ========== STEP 1 - sort out all the links ===========
    const paths = r.reduce((acc,itm) => {

        if(itm.navPath === ''){
            acc.push({
                name:config.siteName,
                path:'/'
            });
        }else{
            acc.push({
                name:itm.displayName,
                path:itm.navPath
            });
        }
        return acc;
    },[],content.pageData)

    // ========== STEP 2 - setup content for the "alllinks" tag ===========
    // set content for all links tags
    alllinks = paths.slice(0);

    // ========== STEP 3 - parse links into groups ===========
    var groups = r.forEach((itm) => {
        if(itm !== ''){
            // split the contents, the second index holds the overall group name
            var groupName = itm.path.split('/')[1];

            if(!grouplinks.hasOwnProperty(groupName)){
                grouplinks[groupName] = [];
                grouplinks[groupName].push(itm);
            }else{
                grouplinks[groupName].push(itm);
            }
        }


    },paths);


    // ========== STEP 4- build navigation ===========
    grouplinks["alllinks"] = alllinks;
    var compiledTemplate = handlebars.compile(layout)(grouplinks);
    content.navigation = compiledTemplate;

    return content;
};