var browserify = require('browserify');
var test = require('tap').test;
var path = require('path');
var babelify = require('../');

test('passes options via configure', function(t) {
  t.plan(3);

  var b = browserify(path.join(__dirname, 'bundle/index.js'));

  b.transform(babelify.configure({
    presets: ['@babel/preset-env'],
    plugins: ['@babel/plugin-transform-property-literals']
  }));

  b.bundle(function (err, src) {
    t.error(err);
    t.match(src.toString(), /"catch": "catch"/);
    t.match(src.toString(), /"delete": "delete"/);
  });
});

test('passes options via browserify', function(t) {
  t.plan(3);

  var b = browserify(path.join(__dirname, 'bundle/index.js'));

  b.transform(babelify, {
    presets: ['@babel/preset-env'],
    plugins: ['@babel/plugin-transform-property-literals']
  });

  b.bundle(function (err, src) {
    t.error(err);
    t.match(src.toString(), /"catch": "catch"/);
    t.match(src.toString(), /"delete": "delete"/);
  });
});
