var browserify = require('browserify');
var test = require('tap').test;
var babelify = require('../');

var files = [
  __dirname + '/bundle/a.js',
  __dirname + '/bundle/b.js',
  __dirname + '/bundle/c.js',
  __dirname + '/bundle/index.js'
];

test('event', function (t) {
  t.plan(7);

  var babelified = [];

  var b = browserify(__dirname + '/bundle/index.js');
  b.transform(babelify);

  b.on('transform', function(tr) {
    if (tr instanceof babelify) {
      tr.once('babelify', function(result, filename) {
        babelified.push(filename);
        t.type(result.metadata.usedHelpers, Array);
      });
    }
  });

  b.bundle(function (err, src) {
    t.error(err);
    t.ok(src);
    t.match(babelified.sort(), files);
  });
});
