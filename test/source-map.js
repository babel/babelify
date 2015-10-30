var browserify = require('browserify');
var convert = require('convert-source-map');
var fs = require('fs');
var test = require('tap').test;
var babelify = require('../');

var sources = [
  __dirname + '/bundle/index.js',
  __dirname + '/bundle/a.js',
  __dirname + '/bundle/b.js',
  __dirname + '/bundle/c.js'
].reduce(function(acc, file) {
  acc[file] = fs.readFileSync(file, 'utf8');
  return acc;
}, {});

// TODO: skipping until I figure out what's going on with paths in Babel 6.0
test('sourceMap', {skip: true}, function(t) {
  t.plan(2);

  var b = browserify({
    entries: [__dirname + '/bundle/index.js'],
    debug: true
  });

  b.transform(babelify.configure({
    sourceMap: true
  }));

  b.bundle(function (err, src) {
    t.error(err);

    var sm = convert
      .fromSource(src.toString())
      .toObject();

    // remove the prelude
    sm.sources.shift();
    sm.sourcesContent.shift();
        
    var aSources = sm.sources.reduce(function(acc, sourceFile, idx) {
      acc[sourceFile] = sm.sourcesContent[idx];
      return acc;
    }, {});

    t.match(aSources, sources);
  });
});
