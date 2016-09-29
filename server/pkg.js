var rollup = require('rollup');
var fs = require('fs');
var log = require('bole')('pkg');
var babel = require('rollup-plugin-babel')
var nodeResolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');

function glsl () {
    return {
        transform ( code, id ) {
            if ( !/\.(glsl|frag|vert)$/.test( id ) ) return;

            return 'export default ' + JSON.stringify(
                    code
                        .replace( /[ \t]*\/\/.*\n/g, '' )
                        .replace( /[ \t]*\/\*[\s\S]*?\*\//g, '' )
                        .replace( /\n{2,}/g, '\n' )
                ) + ';';
        }
    };
}



module.exports = function(src,dest){
    log.info("bundling")
    return rollup.rollup({
        entry:src,
        plugins:[
            glsl(),
            nodeResolve(),
            commonjs(),
            babel({
                exclude:'../node_modules/**'
            })
        ]
    }).then((bundle) => {
        return bundle.write({
            format:'umd',
            dest:__dirname + '/../public/js/main.js'
        })
    }).catch(err => {
        log.error(err);
    })
}