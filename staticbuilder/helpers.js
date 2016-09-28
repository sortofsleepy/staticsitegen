
/**
 * A function to help transforms a line of text into bold.
 * @param content
 * @param classname an optional css class name for the copy
 * @returns {string}
 * This tag requires the triple braces to render the generated html
 * {{{bold "<some copy here>" "<optional classname>" }}}
 */
function bold_helper(content,classname){
    classname = classname !== undefined ? classname : "bold-text";
    return `<b class="${classname}">${content}</b>`
}

/**
 * Helper for writing out links
 * @param path {String} the path of the link you want to output.
 * @param name {String} an optional name to put as the content of the link
  * The tag should look like
 * {{link_to "<path>"}}
 */
function link_helper(path,name,target){
    target = target !== undefined ? target : ""
    name = name !== undefined ? name :""

    var possibleTargets = [
        "_blank",
        "_self",
        "_parent",
        "_top"
    ];

    // filter out for possible target matches
    possibleTargets.forEach(itm => {
        if(itm.search(target) !== -1){
            target = itm;
        }else{
            return "boob"
        }
    });

    return `<a href="${path}" target="${target}">${name}</a>`

}



/**
 * Registers additional helpers for use when compiling
 * templates.
 * @param instance a handlebars instance that is responsible for rendering the content
 * the tag is a part of.
 */
function registerHelpers(instance){
    instance.registerHelper('bold',bold_helper);
    instance.registerHelper('link_to',link_helper);
}


module.exports = registerHelpers;