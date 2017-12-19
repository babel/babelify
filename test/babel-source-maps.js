var assert = require('assert');
var babel = require('@babel/core');
var convert = require('convert-source-map');
var fs = require('fs');
var path = require('path');
var test = require('tap').test;

// Validate assumptions about babel's source maps.

var sourceFile = path.join(__dirname, 'bundle/index.js');
assert(path.isAbsolute(sourceFile));

var sourceSrc = fs.readFileSync(sourceFile, 'utf8');

test('babel source maps (filename and sourceFileName)', function(t) {
  var result = babel.transform(sourceSrc, {
    sourceMaps: 'inline',
    filename: sourceFile,
    sourceFileName: sourceFile,
  });

  // With "sourceFileName", the source path is "sourceFileName".
  var sm = convert
    .fromSource(result.code.toString())
    .toObject();

  t.same(sm.sources, [sourceFile]);

  t.done();
});
