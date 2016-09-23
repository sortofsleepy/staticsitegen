const hogan = require('handlebars')
const fs = require('fs');
const parseHTMLOrMarkdown = require('../staticbuilder/parseHtmlOrMarkdown');
const formatTitle = require('../staticbuilder/titleformater')

module.exports = function(req,reply,options,projectoptions) {

    var layoutPath = `../${projectoptions.projectFullPath}/layouts`

    //lookup the  layout file for the page
    var layoutCore = fs.readFileSync(`${layoutPath}/${options.layoutName}`, 'utf8');
    var name = formatTitle(options.name);
    // build path to page
    var pagePath = `../${projectoptions.projectFullPath}/${options.path}/${options.name}`

    var content = parseHTMLOrMarkdown(pagePath,projectoptions.navigation);
    var compiledTemplate = hogan.compile(layoutCore)({
        content:content,
        title:name,
        navigation:projectoptions.navigation
    });

    reply(compiledTemplate)
}