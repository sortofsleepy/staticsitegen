const fs = require('fs');
const optionsProcessor = require('./staticbuilder/processoptions')
const contentParser = require('./staticbuilder/parsecontent');
const handlebars = require('handlebars');
const nameFormater = require('./staticbuilder/titleformater');
const parsePages = require('./staticbuilder/parseHtmlOrMarkdown');
const r = require('ramda');
const mkdir = require('mkdirp');
const ncp = require('ncp');

function Spackle(){
    // get options from command line
    const options = optionsProcessor();

// setup paths
    const DIST_PATH = options.destinationLocation;
    const CONTENT_PATH = "content/pages"
    const PATH_TO_PROJECT = options.projectFullPath;

// change to project directory
    process.chdir(PATH_TO_PROJECT);

// parse all the content
    var content = contentParser(CONTENT_PATH);

//========= STAGE 1 TRANSFORMATION =================
// First break things down and merge the content with it's respective layout.
    var data = r.reduce((acc,itm) => {
        var regex = new RegExp("\.(png|jpg|gif)");
        const layoutPath = `./layouts/${itm.layoutName}`;
        const pagePath = itm.path;

        // format name
        var name = nameFormater(itm.name);

        var navigation = "";

        // build layout and content
        var layoutCore = fs.readFileSync(layoutPath, 'utf8');
        var content = parsePages(pagePath);
        var compiledTemplate = handlebars.compile(layoutCore)({
            content:content,
            title:name,
            classname:itm.classname,
            navigation:navigation
        });

        itm["template"] = compiledTemplate;

        acc.push(itm);
        return acc;
    },[],content.pageData);


//========== STAGE 2 - COPY CONTENT ================
// Build output directories, first build build directory
    var distExists = fs.existsSync(DIST_PATH);
    if(!distExists){
        mkdir(DIST_PATH)
    }

// finally copy all our content to the distribution directory
    data = r.reduce((acc,itm) => {
        var pathToFile = `${DIST_PATH}${itm.output}`
        var distDir = `${DIST_PATH}${itm.outputDir}`

        mkdir(distDir,function(err){
            if(err){
                console.error(err);
                return;
            }
            // copy file to distribution directory
            fs.writeFile(pathToFile,itm.template,(err) => {
                if(err) throw  err;
            });
        });
    },[],data);
//======= STAGE 3 COPY INDEX AND ASSETS ================

// first copy index page
    var possibleExtensions = [
        '.html',
        '.mk',
        '.md'
    ]
    var dir = fs.readdirSync(`${CONTENT_PATH}/..`);
    dir.forEach(itm => {
        if(itm.search("index") !== -1){
            var index = parsePages(`${CONTENT_PATH}/../${itm}`);
            var layoutCore = fs.readFileSync('./layouts/default.html', 'utf8');
            var compiledTemplate = handlebars.compile(layoutCore)({
                content:index,
                title:"Home",
                classname:"home"
            });
            // copy file to distribution directory
            fs.writeFile(`${DIST_PATH}/index.html`,compiledTemplate,(err) => {
                if(err) throw  err;
            });
        }
    });

// next copy assets, start by copying images
    var images = content.images;
    images.forEach(itm => {
        var pathToFile = `${DIST_PATH}${itm.output}`
        ncp(itm.path,pathToFile,function(err){
            if(err){
                console.log(err);
            }
        })
    })

// lastly copy all the assets over to the distribution directory
    ncp('./content/assets',`${DIST_PATH}/assets`,function(err){
        if(err){
            console.error(err);
            return;
        }
    });


}

module.exports = Spackle;