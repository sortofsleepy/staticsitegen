const hogan = require('hogan.js')
const fs = require('fs');
const parseHTMLOrMarkdown = require('../staticbuilder/parseHtmlOrMarkdown');
const layoutLookup = require('../staticbuilder/layouts');
module.exports = function(req,reply,options){
    // check how many segments there are
    var segments = req.path.split("/");

    // if the length is 2, we know it's either the index or a
    // bit of content in the pages folder
    if(segments.length === 2){
        // if pagename is populated, we know its a page, otherwise we load the index
        // remember - pages are stored in the pages directory
        if(req.params.hasOwnProperty('pagename')){
            var name = req.params.pagename;
            var found = false;
            // figure out if it's a markdown or html file so we can acquire the correct path
            var dir = fs.readdirSync(`./${options.projectLocation}/content/pages`)

            dir.forEach(page => {
                if(page.search(name) !== -1){
                    var page = parseHTMLOrMarkdown(`./${options.projectLocation}/content/pages/${page}`);

                    // load layout content
                    var layoutName = layoutLookup(`./${options.projectLocation}`,"pages");
                    var layout = fs.readFileSync(`./${options.projectLocation}/layouts/${layoutName}`,'utf8');

                    // process the page
                    layout = hogan.compile(layout);
                    reply(layout.render({
                        content:page
                    }))
                    found = true;
                }
            });

            if(!found){
                // load 404

            }

        }else{
            // for index pages, the "default.html" file is the layout used unless otherwise specified
            // when starting the script.

            // first load the page content
            var page = parseHTMLOrMarkdown(`./${options.projectLocation}/content/index.html`);

            // load layout content
            var layout = fs.readFileSync(`./${options.projectLocation}/layouts/${options.indexlayout}`,'utf8');

            // process the page
            layout = hogan.compile(layout);
            reply(layout.render({
                content:page
            }))
        }
    }

    // if we're looking in a subfolder
    // this goes 1 levels at most ie "colors/welcome"
    // index 1 has the folder, index 2 in segments has the page name
    if(segments.length > 2 && segments.length < 4){
        var name = req.params.pagename;

        var found = false;
        // figure out if it's a markdown or html file so we can acquire the correct path
        var dir = fs.readdirSync(`./${options.projectLocation}/content/${segments[1]}`);

        dir.forEach(page => {
            if(page.search(name) !== -1){
                var page = parseHTMLOrMarkdown(`./${options.projectLocation}/content/${segments[1]}/${page}`);

                // load layout content
                var layoutName = layoutLookup(`./${options.projectLocation}`,segments[1]);
                var layout = fs.readFileSync(`./${options.projectLocation}/layouts/${layoutName}`,'utf8');

                // process the page
                layout = hogan.compile(layout);
                reply(layout.render({
                    content:page
                }))
                found = true;
            }
        });

        if(!found){
            // load 404

        }

    }
}