var browserify = require('browserify');
var test = require('tap').test;
var babelify = require('../');

// These tests work, just waiting on https://github.com/babel/babel/pull/2657
test('passes options via configure', {skip: true}, function(t) {
  t.plan(3);

  var b = browserify(__dirname + '/bundle/index.js');

  b.transform(babelify.configure({
    presets: ['es2015'],
    plugins: ['transform-es3-property-literals']
  }));

  b.bundle(function (err, src) {
    t.error(err);
    t.match(src.toString(), /"catch": "catch"/);
    t.match(src.toString(), /"delete": "delete"/);
  });
});

// These tests work, just waiting on https://github.com/babel/babel/pull/2657
test('passes options via browserify', {skip: true}, function(t) {
  t.plan(3);

  var b = browserify(__dirname + '/bundle/index.js');

  b.transform(babelify, {
    presets: ['es2015'],
    plugins: ['transform-es3-property-literals']
  });

  b.bundle(function (err, src) {
    t.error(err);
    t.match(src.toString(), /"catch": "catch"/);
    t.match(src.toString(), /"delete": "delete"/);
  });
});
