var browserify = require('browserify');
var test = require('tap').test;
var babelify = require('../');

test('emits error', function(t) {
  t.plan(2);

  var b = browserify(__dirname + '/bundle/index.js');

  b.transform(babelify.configure({
    whitelist: ['validation.undeclaredVariableCheck']
  }));

  b.bundle(function (err, src) {
    t.notOk(src);
    t.match(err, /reference to undeclared variable/i);
  });
});
