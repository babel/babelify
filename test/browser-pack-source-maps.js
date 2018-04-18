var browserify = require('browserify');
var convert = require('convert-source-map');
var path = require('path');
var zipObject = require('lodash.zipobject');
var test = require('tap').test;
var babelify = require('../');

// Validate assumptions about browserify's browser-pack source maps. Without
// intermediate source maps, the source is a relative path from the "basedir".
// When "basedir" is not set, it's `process.cwd()`.

test('browserify source maps (no basedir)', function(t) {
  t.plan(14);

  // normalize cwd
  process.chdir(path.join(__dirname, '..'));

  var b = browserify({
    entries: [path.join(__dirname, 'bundle/index.js')],
    debug: true
  });

  b.transform(babelify, {
    presets: ['@babel/preset-env'],
    sourceMaps: false   // no intermediate source maps
  });

  var deps = {};
  b.on('dep', function(dep) {
    t.ok(path.isAbsolute(dep.file));
    deps[dep.file] = dep.source;
  });

  b.bundle(function (err, src) {
    t.error(err);

    var sm = convert
      .fromSource(src.toString())
      .toObject();

    // remove the prelude
    sm.sources.shift();
    sm.sourcesContent.shift();

    // source paths are relative to the basedir (cwd if not set)
    sm.sources.forEach(function(source) {
      t.ok(!path.isAbsolute(source));
      var aSource = path.join(__dirname, '..', source);
      t.ok(deps.hasOwnProperty(aSource));
    });

    var smDeps = zipObject(
      sm.sources.map(function(x) { return path.join(__dirname, '..', x); }),
      sm.sourcesContent
    );

    t.match(sort(smDeps), sort(deps));
  });
});

test('browserify source maps (with basedir)', function(t) {
  t.plan(14);

  // normalize cwd
  process.chdir(path.join(__dirname, '..'));

  var b = browserify({
    entries: [path.join(__dirname, 'bundle/index.js')],
    basedir: __dirname,
    debug: true
  });

  b.transform(babelify, {
    presets: ['@babel/preset-env'],
    sourceMaps: false   // no intermediate source maps
  });

  var deps = {};
  b.on('dep', function(dep) {
    t.ok(path.isAbsolute(dep.file));
    deps[dep.file] = dep.source;
  });

  b.bundle(function (err, src) {
    t.error(err);

    var sm = convert
      .fromSource(src.toString())
      .toObject();

    // remove the prelude
    sm.sources.shift();
    sm.sourcesContent.shift();

    // source paths are relative to the basedir (cwd if not set)
    sm.sources.forEach(function(source) {
      t.ok(!path.isAbsolute(source));
      var aSource = path.join(__dirname, source);
      t.ok(deps.hasOwnProperty(aSource));
    });

    var smDeps = zipObject(
      sm.sources.map(function(x) { return path.join(__dirname, x); }),
      sm.sourcesContent
    );

    t.match(sort(smDeps), sort(deps));
  });
});

function sort(obj) {
  return Object.keys(obj).sort().reduce(function(acc, k) {
    acc[k] = obj[k];
    return acc;
  }, {});
}
