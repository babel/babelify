var path = require('path');
var spawn = require('child_process').spawn;
var test = require('tap').test;
var vm = require('vm');

test('browserify-cli', function (t) {
  t.plan(3);

  var entry = path.join(__dirname, '/bundle/index.js');
  var babelify = path.join(__dirname, '../');

  var cmd = require.resolve('browserify/bin/cmd.js');
  var args = [
    '-r', entry + ':bundle',
    '-t', '[', babelify, '--presets', 'es2015', ']'
  ];

  var out = '';
  var err = '';

  var ps = spawn(cmd, args);
  ps.stdout.on('data', function(buf) { out += buf; });
  ps.stderr.on('data', function(buf) { err += buf; });

  ps.on('error', function(err) { throw err; });
  ps.on('exit', function(code) {
    t.notOk(err);
    t.equal(code, 0);

    var c = {};
    vm.runInNewContext(out, c);

    t.equal(c.require('bundle').a, 'a is for apple');
  });
});
