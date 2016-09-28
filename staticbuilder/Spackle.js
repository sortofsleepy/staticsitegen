const fs = require('fs');
const Readable = require('stream').Readable;


var Spackle = function(content){
    this.currentData = content;
};

Spackle.prototype = {
    /**
     * Takes the current dataset and transforms it using the transform parameter
     * @param transform {Function} A function that accepts the current dataset
     * and applies some kind of transform to it.
     */
    use:function(transform){

    },

    /**
     * Outputs the final transformed code once all of the processes have been accomplished
     */
    output:function(){

    }
};

module.exports = Spackle;