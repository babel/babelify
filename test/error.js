var browserify = require('browserify');
var path = require('path');
var test = require('tap').test;
var babelify = require('../');

test('emits error', function(t) {
  t.plan(2);

  var b = browserify(path.join(__dirname, 'bundle/error.js'));

  b.transform(babelify.configure({presets: ['@babel/preset-env']}));

  b.bundle(function (err, src) {
    t.notOk(src);
    t.match(err, /super\(\) is only valid inside a class constructor of a subclass/i);
  });
});
