var r = require('ramda')

/**
 * Groups and reorders paths that have similar urls so they
 * end up next to each other.
 * @param pathData the path data as parsed by the parsecontent.js file
 */
module.exports = function(pathData){
    var finalData = [];

    // first split into unique groups by splitting the path up based on backslashes.
    // if the resulting array is greater than 1, we know we have may have a group of urls
    var groups = r.reduce((acc,itm) => {
        var path = itm.path.split('/');
        path.shift();

        if(path.length > 1){
            acc.push(path[0]);
        }
        return acc;
    },[],pathData)

    // remove duplicates groups
    var groups = r.uniq(groups);

    pathData = pathData.map(itm => {
        // check path and see if it belongs to a group
        for(var i = 0; i < groups.length; ++i){
            if(itm.path.search(groups[i]) !== -1){
                itm.groupName = groups[i];
            }
        }
        return itm;
    });

    return pathData;
}