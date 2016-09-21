var fs = require('fs');
var path = require('path');


/**
 * Builds the content tree and figures out what content there is and it's respective template.
 * Ignores "assets" directory
 * @param dir the current directory  we're looking at
 * @param filelist the current list of files
 * @returns {*|Array} returns an array of content file names, the path to those files and the layout to use for each file
 */
function walk(dir,filelist){
    var files = fs.readdirSync(dir);
    var results = filelist || [];

    files.forEach(file => {
        var filepath = `${dir}/${file}`;

        if(dir.search("assets") === -1){
            if(fs.statSync(filepath).isDirectory()){
                results = walk(filepath,results);
            }else{
                // parse the layout name, should be the third segment
                var tmp = dir.split("/");
                var layout = "";
                if(tmp[2] === undefined){
                    layout = "default.html"
                }else if(dir.search("pages") !== -1) {
                    layout = "page.html";
                } else {
                    layout = tmp[2] + ".html";
                }
                results.push({
                    name:file,
                    path:path.dirname(filepath),
                    layoutName:layout
                })
            }
        }
    })

    return results;
}

module.exports = walk;