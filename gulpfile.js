var gulp = require('gulp');
const options = require('minimist')(process.argv.slice(3));
const compiler = require('./compiler.js');
const optionsProcessor = require('./staticbuilder/processoptions')
gulp.task('compile-site',function(){
    const options = optionsProcessor();
    compiler(options);
})

gulp.task('default',['compile-site'],function(){
    // get the directory our project is in
    var dir = options.project !== undefined ? options.project : "./site"
    gulp.watch(["./content/**/*.html"],['compile-site']);
});