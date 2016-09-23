const fs = require('fs');
const markdown = require('markdown').markdown;
const hogan = require('handlebars');
const generateNavigation = require('./navigation');

/**
 * Parses the HTML/Markdown content
 * @param filepath the path to the file to process
 * @param navigation an optional navigation template string
 * @returns {*}
 */
module.exports = function(filepath,navigation){

    var contents = fs.readFileSync(filepath,'utf8');

    if(filepath.search('.md') !== -1 || filepath.search('.mk') !== -1){

        // run through hogan first
        var hParse = hogan.compile(contents)({
           navigation:navigation
        });
        return markdown.toHTML(hParse);
    }else{

        var html = hogan.compile(contents)({
            navigation:navigation
        });
        return html;
    }
}