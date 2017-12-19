var browserify = require('browserify');
var path = require('path');
var test = require('tap').test;
var babelify = require('../');

var files = [
  path.join(__dirname, 'bundle/a.js'),
  path.join(__dirname, 'bundle/b.js'),
  path.join(__dirname, 'bundle/c.js'),
  path.join(__dirname, 'bundle/index.js')
];

test('event', function (t) {
  t.plan(7);

  var babelified = [];

  var b = browserify(path.join(__dirname, 'bundle/index.js'));
  b.transform([babelify, {presets: ['@babel/preset-env']}]);

  b.on('transform', function(tr) {
    if (tr instanceof babelify) {
      tr.once('babelify', function(result, filename) {
        babelified.push(filename);
        t.type(result.code, 'string');
      });
    }
  });

  b.bundle(function (err, src) {
    t.error(err);
    t.ok(src);
    t.match(babelified.sort(), files);
  });
});
