var browserify = require('browserify');
var convert = require('convert-source-map');
var fs = require('fs');
var test = require('tap').test;
var babelify = require('../');

var sources = [
  'bundle/index.js',
  'bundle/a.js'
].reduce(function(acc, file) {
  acc[file] = fs.readFileSync(__dirname + '/' + file, 'utf8');
  return acc;
}, {});

test('sourceMapRelative', function(t) {
  t.plan(2);

  var b = browserify({
    entries: [__dirname + '/bundle/index.js'],
    basedir: __dirname,
    debug: true
  });

  b.transform(babelify.configure({
    sourceMap: true,
    sourceMapRelative: __dirname
  }));

  b.bundle(function(err, src) {
    t.error(err);

    var sm = convert
      .fromSource(src.toString())
      .toObject();

    // basically exclude the prelude
    var aSources = {};
    sm.sources.forEach(function(sourceFile, idx) {
      if (sources[sourceFile]) {
        aSources[sourceFile] = sm.sourcesContent[idx];
      }
    });

    t.same(aSources, sources);
  });
});
