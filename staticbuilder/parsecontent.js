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
                   //====== DERIVE LAYOUT FOR FILE ======
                   var tmp = dir.split("/");
                   var layout = "";
                   if(tmp.length > 1){
                       layout = tmp[1] + ".html";
                   }else{
                       layout = "default.html";
                   }
                    // ensure layout exists
                   if(!fs.existsSync(`./layouts/${layout}`)){
                       layout = "default.html"
                   }
                   //====== SETUP OUTPUT PATH======
                   var outputPath = path.dirname(filepath).replace("content","");
                   if(outputPath === ''){
                       outputPath = '/'
                   }


                   //====== BUILD CLASSNAME for CSS ======
                   var classname = file.split(".");
                   classname.pop();

                   //====== BUILD DISPLAY NAME ======
                   var displayName = "";
                    if(file.search('index') !== -1){
                        var dirName = dir.split('/')


                        //if length is greater than 1 (which indicates the index), take the last value in the array as the
                        // display name
                        if(dirName.length > 1){
                            classname[0] = dirName[dirName.length - 1] + "-index";
                            displayName = dirName[dirName.length - 1];
                        }
                    }else {
                        displayName = classname[0];
                    }


                   //======= BUILD LINK PATH TO PAGE ============

                   outputPath = outputPath.replace("/pages","");
                   var cleanFilename = "";
                   if(file.search('index') !== -1){
                       cleanFilename = outputPath.split('.')[0];
                   }else{
                       var pathAndFile = `${outputPath}/${file}`;
                        cleanFilename = pathAndFile.split('.')[0]
                   }
                   results.push({

                       // the name of the file
                       name:file,

                       // CSS classname to reference the page
                       classname:classname[0],

                       // the displayname for the page
                       // TODO add in string formatter
                       displayName:displayName,

                       // path to the file from an i/o standpoint
                       path:path.dirname(filepath) + "/" + file,

                       // name of the layout
                       layoutName:layout,

                       // path of where to write the file
                       output:`${outputPath}/${file}`,

                       // path of what the link to the page would look like
                       navPath:cleanFilename
                   })
               }
           }
       }
    })

    // ====== FILTER OUT IMAGES =============
    // since images could also be in the same directory, filter those out of the overall content map
    results.map(itm => {
        var regex = new RegExp("\.(png|jpg|gif)");
        if(itm.name.search(regex) === -1){
            return itm;
        }
    });

    console.log(results);
    return results;
}

module.exports = walk;