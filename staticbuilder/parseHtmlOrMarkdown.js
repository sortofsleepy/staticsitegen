const fs = require('fs');
const markdown = require('markdown').markdown;
const hogan = require('hogan.js');
const generateNavigation = require('./navigation');

module.exports = function(filepath,navigation){

    var contents = fs.readFileSync(filepath,'utf8');

    if(filepath.search('.md') !== -1 || filepath.search('.mk') !== -1){

        // run through hogan first
        var hParse = hogan.compile(contents).render({
           navigation:navigation
        });
        return markdown.toHTML(hParse);
    }else{

        var html = hogan.compile(contents).render({
            navigation:navigation
        });
        return html;
    }
}