var browserify = require('browserify');
var convert = require('convert-source-map');
var path = require('path');
var fs = require('fs');
var zipObject = require('lodash.zipobject');
var test = require('tap').test;
var babelify = require('../');

var sources = [
  path.join(__dirname, 'bundle/index.js'),
  path.join(__dirname, 'bundle/a.js'),
  path.join(__dirname, 'bundle/b.js'),
  path.join(__dirname, 'bundle/c.js')
].reduce(function(acc, file) {
  acc[file] = fs.readFileSync(file, 'utf8');
  return acc;
}, {});

test('sourceMapsAbsolute', function(t) {
  t.plan(2);

  var b = browserify({
    entries: [path.join(__dirname, 'bundle/index.js')],
    debug: true
  });

  b.transform(babelify.configure({
    presets: ['@babel/preset-env'],
    sourceMapsAbsolute: true
  }));

  b.bundle(function (err, src) {
    t.error(err);

    var sm = convert
      .fromSource(src.toString())
      .toObject();

    // remove the prelude
    sm.sources.shift();
    sm.sourcesContent.shift();

    t.match(zipObject(sm.sources, sm.sourcesContent), sources);
  });
});
