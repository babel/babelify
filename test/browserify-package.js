var browserify = require('browserify');
var path = require('path');
var test = require('tap').test;
var vm = require('vm');

test('browserify package', function (t) {
  t.plan(3);

  process.env.NODE_ENV = 'development';

  var b = browserify();
  b.require(path.join(__dirname, 'pkg-app/index.js'), {expose: 'pkgApp'});

  b.bundle(function (err, src) {
    t.error(err);

    var c = {};
    vm.runInNewContext(src, c);

    c.require('pkgApp')({
      createClass: function(obj) {
        t.equal(obj.envLength(), process.env.NODE_ENV.length);
        t.equal(obj.displayName, 'TestComponent')
      }
    });
  });
});
