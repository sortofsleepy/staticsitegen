var respModifier = require('resp-modifier')
var path = require('path')
var fs = require('fs');

var script = fs.readFileSync(__dirname + '/reloadscript.html','utf8');

module.exports = injectLiveReloadSnippet
function injectLiveReloadSnippet (opts) {
    opts = opts || {}

    var modifier = respModifier({
        rules: [
            { match: /<body[^>]*>/i, fn: prepend }
        ]
    })

    var fn = function (req, res, next) {
        var ext = path.extname(req.url)
        if (!ext || /\.html?$/i.test(ext)) {
            if (!req.headers.accept) {
                req.headers.accept = 'text/html'
            }
        }
        modifier(req, res, next)
    }

    fn.host = opts.host
    fn.port = opts.port

    function snippet () {
        var host = fn.host || 'localhost'
        var port = fn.port || 35729
        var src = '//' + host + ':' + port + '/livereload.js?snipver=1'
        return script;
    }

    function prepend (req, res, body) {
        return body + snippet()
    }

    return fn
}