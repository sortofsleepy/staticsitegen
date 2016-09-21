const fs = require('fs');
module.exports =  function determineLayout(basepath,layoutName){
    var layoutfile = null;

    // get a list of all the layouts files
    var layouts = fs.readdirSync(basepath + "/layouts");

    // loop through layouts and see if theres a layout file for it, if not use "default.html"
    layouts.forEach((layout) => {
        if(layout.search(layoutName) !== -1){
            layoutfile = layout;
        }
    });

    if(layoutfile === null){
        layoutfile = "default.html";
    }

    return layoutfile;
}