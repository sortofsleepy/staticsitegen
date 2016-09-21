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
       if(file !== ".DS_Store"){
           var filepath = `${dir}/${file}`;

           // skip assets folder
           if(dir.search("assets") === -1){

               // if current path is a directory,
               // start walking that directory
               // otherwise add an entry in the results array
               if(fs.statSync(filepath).isDirectory()){
                   results = walk(filepath,results);
               }else{
                   // parse the layout name, should be the third segment
                   var tmp = dir.split("/");

                   var layout = "";
                   if(tmp.length > 1){
                       layout = tmp[1] + ".html";
                   }else{
                       layout = "default.html";
                   }
                   var outputPath = path.dirname(filepath).replace("content","");
                   if(outputPath === ''){
                       outputPath = '/'
                   }

                   // ensure layout file exists
                   if(!fs.existsSync(`./layouts/${layout}`)){
                       layout = "default.html"
                   }

                   //TODO build output path based on the same structure
                   results.push({
                       name:file,
                       path:path.dirname(filepath),
                       layoutName:layout,
                       output:outputPath
                   })
               }
           }
       }
    })

    return results;
}

module.exports = walk;