var browserify = require('browserify');
var convert = require('convert-source-map');
var path = require('path');
var test = require('tap').test;
var babelify = require('../');

test('sourceMaps: false', function(t) {
  t.plan(2);

  var b = browserify({
    entries: [__dirname + '/bundle/index.js'],
    debug: true
  });

  b.transform(babelify, {
    presets: ['es2015'],
    sourceMaps: false
  });

  var sources = {};
  b.on('dep', function(dep) {
    sources[dep.file] = dep.source;
  });

  b.bundle(function (err, src) {
    t.error(err);

    var sm = convert
      .fromSource(src.toString())
      .toObject();

    // remove the prelude
    sm.sources.shift();
    sm.sourcesContent.shift();

    var aSources = sm.sources.reduce(function(acc, sourceFile, idx) {
      var filename = path.join(process.cwd(), sourceFile);
      acc[filename] = sm.sourcesContent[idx];
      return acc;
    }, {});

    t.match(sort(aSources), sort(sources));
  });
});

function sort(obj) {
  return Object.keys(obj).sort().reduce(function(acc, k) {
    acc[k] = obj[k];
    return acc;
  }, {});
}
