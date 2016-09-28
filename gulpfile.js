var gulp = require('gulp');
const options = require('minimist')(process.argv.slice(3));
const fs = require('fs');
const hogan = require('handlebars');
const formatTitle = require('./staticbuilder/titleformater');
const parseHTMLOrMarkdown = require('./staticbuilder/parseHtmlOrMarkdown');
const ncp = require('ncp').ncp
const optionsProcessor = require('./staticbuilder/processoptions')
const contentParser = require('./staticbuilder/parsecontent');
const buildNavigation = require('./staticbuilder/navigation');
const mkdir = require('mkdirp')

gulp.task('compile-site',function(){
    const options = optionsProcessor();

    // path to where the un-compiled files are
    const DIST_PATH = options.destinationLocation;
    const CONTENT_PATH = "content"
    const PATH_TO_PROJECT = options.projectFullPath;

    // make a "build folder" folder if not already present.
    var distExists = fs.existsSync(DIST_PATH);
    if(!distExists){
        mkdir(DIST_PATH)
    }

    // parse all of the content for the site
    var contentData = contentParser(CONTENT_PATH);

// build a list of links agains the navigation template
    var navigation = buildNavigation(contentData,options,true);

    // build and compile all the data together
    contentData.forEach(data => {
        const layoutPath = `./layouts/${data.layoutName}`;
        const pagePath = `${data.path}/${data.name}`;

        // build the title for the page which is based on the filename.
        var name = formatTitle(data.name);

        var layoutCore = fs.readFileSync(layoutPath, 'utf8');
        var content = parseHTMLOrMarkdown(pagePath,navigation);
        var compiledTemplate = hogan.compile(layoutCore)({
            content:content,
            title:name,
            classname:data.classname,
            navigation:navigation
        });

        var page = data.name;
        if(page.search(".mk") !== -1){
            page = page.replace(".mk",".html");
        }

        if(page.search(".md") !== -1) {
            page = page.replace(".md", ".html");
        }

        // build output directory and output path
        var outputPath = "";
        var pathToFile = ""
        if(data.output.search("pages") !== -1){
            outputPath = `${DIST_PATH}/${page}`
            pathToFile = DIST_PATH;
        }else{
            outputPath = `${DIST_PATH}/${data.output}/${page}`
            pathToFile = DIST_PATH + data.output
        }

        mkdir(pathToFile,function(err){
            if(err){
                console.error(err);
                return;
            }
            // copy file to distribution directory
            fs.writeFile(outputPath,compiledTemplate,(err) => {
                if(err) throw  err;
            });
        });
    });

// lastly copy all the assets over to the distribution directory
    ncp('./content/assets',`${DIST_PATH}/assets`,function(err){
        if(err){
            console.error(err);
            return;
        }
    });


});



gulp.task('default',['compile-site'],function(){
    // get the directory our project is in
    var dir = options.project !== undefined ? options.project : "./site"
    gulp.watch([
        "content/**/*.html",
        "content/**/*.mk",
        "content/**/*.md",
        "content/assets/**/*.scss",
        "content/assets/**/*.css",
        "layouts/**/*.html",
    ],['compile-site']);
});