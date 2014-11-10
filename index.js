var through = require("through");
var path    = require("path");
var to5     = require("6to5");
var _       = require("lodash");

var browserify = module.exports = function (filename) {
  return browserify.configure()(filename);
};

browserify.configure = function (opts) {
  opts = opts || {};
  opts.sourceMap = opts.sourceMap !== false ? "inline" : false;

  return function (filename) {
    if ((opts.ignore && opts.ignore.test(filename)) || !to5.canCompile(filename, opts.extensions)) {
      return through();
    }
    
    var data = "";

    var write = function (buf) {
      data += buf;
    };

    var end = function () {
      var opts2 = _.clone(opts);
      opts2.filename = filename;

      try {
        var out = to5.transform(data, opts2).code;
      } catch(err) {
        stream.emit("error", err);
        stream.queue(null);
        return;
      }
      
      stream.queue(out);
      stream.queue(null);
    };

    var stream = through(write, end);
    return stream;
  };
};
