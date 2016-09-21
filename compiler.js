const fs = require('fs');
const determineLayout = require('./staticbuilder/layouts')
const hogan = require('hogan.js');
const formatTitle = require('./staticbuilder/titleformater');
const parseHTMLOrMarkdown = require('./staticbuilder/parseHtmlOrMarkdown');
const ncp = require('ncp').ncp
const optionsProcessor = require('./staticbuilder/processoptions')
const contentParser = require('./staticbuilder/parsecontent');
// setup options
const options = optionsProcessor();

// path to where the un-compiled files are
const DIST_PATH = options.destinationLocation;
const BASE_PATH = options.projectLocation
const CONTENT_PATH = `${BASE_PATH}/content`

// make a "dist" folder if not already present.
var distExists = fs.existsSync(DIST_PATH);
if(!distExists){
    fs.mkdirSync(DIST_PATH)
}

// parse all of the content for the site
var contentData = contentParser(CONTENT_PATH);

contentData.forEach(data => {
    const layoutPath = `${BASE_PATH}/layouts/${data.layoutName}`;
    const pagePath = `${data.path}/${data.name}`;

    // build the title for the page which is based on the filename.
    var name = formatTitle(data.name);


    var layoutCore = fs.readFileSync(layoutPath, 'utf8');

    var content = parseHTMLOrMarkdown(pagePath);
    var compiledTemplate = hogan.compile(layoutCore).render({
        content:content,
        title:name
    });

    var page = data.name;
    if(page.search(".mk") !== -1){
        page = page.replace(".mk",".html");
    }

    if(page.search(".md") !== -1) {
        page = page.replace(".md", ".html");
    }




});

