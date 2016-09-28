/**
 * Formats a file title into something a bit nicer.
 * Current rules are
 * 1. Uppercase the first character
 * 2. if the name has underscores, convert those to spaces
 * @param title
 */
module.exports = function(title){
    // first of, remove extension
    title = title.split(".");
    title.pop();
    title = title.join("");

    // uppercase the first character
    var char = title.charAt(0);
    title = title.replace(char,char.toUpperCase());

    // if it has underscores, those become spaces.
    title = title.split("");
    title = title.map((char) => {
        if(char === "_"){
            return " ";
        }else {
            return char;
        }
    });
    return title.join("");
};