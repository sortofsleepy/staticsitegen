const fs = require('fs');
const markdown = require('markdown').markdown;
const h = require('handlebars');
const generateNavigation = require('./navigation');
const registerHelpers = require('./helpers')
/**
 * Parses the HTML/Markdown content
 * @param filepath the path to the file to process
 * @param navigation an optional navigation template string
 * @returns {*}
 */
module.exports = function(filepath,navigation){

    var contents = fs.readFileSync(filepath,'utf8');
    registerHelpers(h);
    if(filepath.search('.md') !== -1 || filepath.search('.mk') !== -1){

        // run through h first
        var hParse = h.compile(contents)();
        return markdown.toHTML(hParse);
    }else{

        var html = h.compile(contents)();
        return html;
    }
}