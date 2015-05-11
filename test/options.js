var browserify = require('browserify');
var test = require('tap').test;
var babelify = require('../');

test('passes options', function(t) {
  t.plan(3);

  var b = browserify(__dirname + '/bundle/index.js');

  b.transform(babelify.configure({
    optional: ['es3.propertyLiterals']
  }));

  b.bundle(function (err, src) {
    t.error(err);
    t.match(src.toString(), /"catch": "catch"/);
    t.match(src.toString(), /"delete": "delete"/);
  });
});
