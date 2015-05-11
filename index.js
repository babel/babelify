var through = require("through2");
var assign  = require("object-assign");
var babel   = require("babel-core");
var path    = require("path");

var browserify = module.exports = function (filename, opts) {
  return browserify.configure(opts)(filename);
};

browserify.configure = function (opts) {
  opts = opts || {};
  if (opts.sourceMap !== false) opts.sourceMap = "inline" ;
  if (opts.extensions) opts.extensions = babel.util.arrayify(opts.extensions);

  return function (filename) {
    if (!babel.canCompile(filename, opts.extensions)) {
      return through();
    }

    if (opts.sourceMapRelative) {
      filename = path.relative(opts.sourceMapRelative, filename);
    }

    var data = "";

    var write = function (buf, enc, callback) {
      data += buf;
      callback();
    };

    var end = function (callback) {
      var opts2 = assign({}, opts);
      delete opts2.sourceMapRelative;
      delete opts2.extensions;
      delete opts2.global;
      opts2.filename = filename;

      try {
        this.push(babel.transform(data, opts2).code);
      } catch(err) {
        this.emit("error", err);
      }
      callback();
    };

    return through(write, end);
  };
};
