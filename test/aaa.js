var browserify = require('browserify');
var test = require('tap').test;
var vm = require('vm');
var babelify = require('../');

test('aaa', function (t) {
  t.plan(2);

  var b = browserify();

  b.require(__dirname + '/bundle/index.js', {expose: 'bundle'});
  b.transform(babelify);

  b.bundle(function (err, src) {
    t.error(err);
    var c = {};
    vm.runInNewContext(src, c);

    t.equal(c.require('bundle').a, 'a is for apple');
  });
});
