const fs = require('fs');
const determineLayout = require('./staticbuilder/layouts')
const hogan = require('hogan.js');
const formatTitle = require('./staticbuilder/titleformater');
const parseHTMLOrMarkdown = require('./staticbuilder/parseHtmlOrMarkdown');
const ncp = require('ncp').ncp
const optionsProcessor = require('./staticbuilder/processoptions')
/**
 * Notes -
 * 1. "layouts" is a excluded directory. That should store uncompiled content.
 * 2. "pages" is the default directory for any content that is meant to be shown on their own page.
 */

const options = optionsProcessor();

// path to where the un-compiled files are
const DIST_PATH = options.destinationLocation;
const BASE_PATH = options.projectLocation
const CONTENT_PATH = `${BASE_PATH}/content`

// the directories that don't contain any content files or files that are core
const excluded = [
    "layouts",
    "assets",
    "index.html"
]

// read the directory and filter based on the excluded variable above
var content = fs.readdirSync(CONTENT_PATH,"utf8");
content = content.filter((page) => {
    var fn = excluded.indexOf(page);
    if(fn === -1){
        return page;
    }
});

// make a "dist" folder if not already present.
var distExists = fs.existsSync(DIST_PATH);
if(!distExists){
    fs.mkdirSync(DIST_PATH)
}

// read the directories of all the files that contain content, match it up with it's layouts
// file(the name of which is determined by it's folder name) and compile
content = content.map((obj) => {
    // if it's not the folder "pages", which should have all of the single page content, ie http://styelguide.com/welcome.html
    // create a folder for it in the dist folder so it'll form the path like http://styelguide.com/colors/<page in the colors folder>
    if (obj !== "pages") {
        if (!fs.existsSync(DIST_PATH + "/" + obj)) {
            fs.mkdirSync(DIST_PATH + "/" + obj)
        }
    }

    // get the layout file name
    var layout = determineLayout(BASE_PATH, obj);

    // loop through grab all the pages in the current directory of the loop
    var pages = fs.readdirSync(`${CONTENT_PATH}/${obj}`, 'utf8');
    var pagePath = `${CONTENT_PATH}/${obj}/`;


    pages = pages.map((page)=> {
        var fullpath = pagePath + page;
        if(obj === "pages"){ 
            distPath = `${DIST_PATH}/` 
        }else{ 
            distPath = `${DIST_PATH}/${obj}` 
        }
        // form the page name 
        var name = formatTitle(page)
        // compile the layout file 
        var layoutCore = fs.readFileSync(BASE_PATH + "/layouts/" + layout, 'utf8');

        var content = parseHTMLOrMarkdown(fullpath);
        var compiledTemplate = hogan.compile(layoutCore).render({ 
            content:content, 
            title:name
        });



        if(page.search(".mk") !== -1){
            page = page.replace(".mk",".html");
        }

        if(page.search(".md") !== -1) {
            page = page.replace(".md", ".html");
        }


        fs.writeFile(`${distPath}/${page}`,compiledTemplate,(err) => {
            if(err) throw  err;
        })

    })
    return pages.join()
});

// next : parse and write the index file 
// If the indexlayout option isn't specified, we just use default
 var index_layout = options.indexlayout;  
var layoutCore = fs.readFileSync(BASE_PATH + "/layouts/" + index_layout,'utf8'); 
var indexContent = fs.readFileSync(CONTENT_PATH + "/index.html","utf8");
 var compiledTemplate = hogan.compile(layoutCore).render({ 
    content:indexContent, 
     title:"Home"
});

 fs.writeFile(`dist/index.html`,compiledTemplate, (err) => { 
    if(err) throw err;
  })  // lastly, copy assets to dist folder
  ncp('./site/content/assets','./dist/assets',function(err){ 
     if(err){ 
         console.error(err); 
         return; 
     }
      
 });

