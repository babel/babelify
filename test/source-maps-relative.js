var browserify = require('browserify');
var convert = require('convert-source-map');
var fs = require('fs');
var path = require('path');
var zipObject = require('lodash.zipobject');
var test = require('tap').test;
var babelify = require('../');

process.chdir(path.join(__dirname, '..'));

var sources = [
  path.join(__dirname, 'bundle/index.js'),
  path.join(__dirname, 'bundle/a.js'),
  path.join(__dirname, 'bundle/b.js'),
  path.join(__dirname, 'bundle/c.js')
].reduce(function(acc, file) {
  acc[file] = fs.readFileSync(file, 'utf8');
  return acc;
}, {});

test('source maps relative (cwd)', function(t) {
  t.plan(2);

  var b = browserify({
    entries: [path.join(__dirname, 'bundle/index.js')],
    debug: true
  });

  b.transform(babelify.configure({
    presets: ['@babel/preset-env']
  }));

  b.bundle(function(err, src) {
    t.error(err);

    var sm = convert
      .fromSource(src.toString())
      .toObject();

    // remove the prelude
    sm.sources.shift();
    sm.sourcesContent.shift();

    var actual = zipObject(sm.sources, sm.sourcesContent);

    var expected = Object.keys(sources).reduce(function(acc, file) {
      acc[path.relative(process.cwd(), file)] = sources[file];
      return acc;
    }, {});

    t.match(actual, expected);
  });
});

test('source maps relative (basedir)', function(t) {
  t.plan(2);

  var b = browserify({
    entries: [path.join(__dirname, 'bundle/index.js')],
    basedir: __dirname,
    debug: true
  });

  b.transform(babelify.configure({
    presets: ['@babel/preset-env']
  }));

  b.bundle(function(err, src) {
    t.error(err);

    var sm = convert
      .fromSource(src.toString())
      .toObject();

    // remove the prelude
    sm.sources.shift();
    sm.sourcesContent.shift();

    var actual = zipObject(sm.sources, sm.sourcesContent);

    var expected = Object.keys(sources).reduce(function(acc, file) {
      acc[path.relative(__dirname, file)] = sources[file];
      return acc;
    }, {});

    t.match(actual, expected);
  });
});
