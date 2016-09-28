module.exports = function(name){
    var possibleExtensions = [
        '.md',
        '.mk'
    ];

    var finalName = name;
    possibleExtensions.forEach(itm => {
        if(name.search(itm) !== -1){
            finalName = name.replace(itm,'.html');
        }
    })


    return finalName;
}