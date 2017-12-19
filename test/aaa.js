var browserify = require('browserify');
var test = require('tap').test;
var path = require('path');
var vm = require('vm');
var babelify = require('../');

test('aaa', function (t) {
  t.plan(2);

  var b = browserify();

  b.require(path.join(__dirname, 'bundle/index.js'), {expose: 'bundle'});
  b.transform([babelify, {presets: ['@babel/preset-env']}]);

  b.bundle(function (err, src) {
    t.error(err);
    var c = {};
    vm.runInNewContext(src, c);

    t.equal(c.require('bundle').a, 'a is for apple');
  });
});
