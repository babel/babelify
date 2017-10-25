var browserify = require('browserify');
var path = require('path');
var test = require('tap').test;
var babelify = require('../');

test('emits error', function(t) {
  t.plan(2);

  var b = browserify(path.join(__dirname, 'bundle/index.js'));

  b.transform(babelify.configure({
    presets: ['env'],
    plugins: ['undeclared-variables-check']
  }));

  b.bundle(function (err, src) {
    t.notOk(src);
    t.match(err, /reference to undeclared variable/i);
  });
});
