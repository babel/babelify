var browserify = require('browserify');
var convert = require('convert-source-map');
var fs = require('fs');
var test = require('tap').test;
var babelify = require('../');

var sources = [
  'bundle/index.js',
  'bundle/a.js',
  'bundle/b.js',
  'bundle/c.js'
].reduce(function(acc, file) {
  acc[file] = fs.readFileSync(__dirname + '/' + file, 'utf8');
  return acc;
}, {});

test('sourceMapRelative', function(t) {
  t.plan(2);

  process.chdir(__dirname);

  var b = browserify({
    entries: [__dirname + '/bundle/index.js'],
    debug: true
  });

  b.transform(babelify.configure({
    presets: ['es2015'],
    sourceMapRelative: __dirname
  }));

  b.bundle(function(err, src) {
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
