var through = require("through2");
var assign  = require("object-assign");
var babel   = require("babel-core");
var path    = require("path");

var browserify = module.exports = function (filename, opts) {
  return browserify.configure(opts)(filename);
};

browserify.configure = function (opts) {
  opts = assign({}, opts);
  var extensions = opts.extensions ? babel.util.arrayify(opts.extensions) : null;
  var sourceMapRelative = opts.sourceMapRelative;
  if (opts.sourceMap !== false) opts.sourceMap = "inline";

  // babelify specific options
  delete opts.sourceMapRelative;
  delete opts.extensions;
  delete opts.filename;

  // browserify specific options
  delete opts._flags;
  delete opts.basedir;
  delete opts.global;

  return function (filename) {
    if (!babel.canCompile(filename, extensions)) {
      return through();
    }

    if (sourceMapRelative) {
      filename = path.relative(sourceMapRelative, filename);
    }

    var data = "";

    var write = function (buf, enc, callback) {
      data += buf;
      callback();
    };

    var end = function (callback) {
      opts.filename = filename;
      try {
        this.push(babel.transform(data, opts).code);
      } catch(err) {
        this.emit("error", err);
      }
      callback();
    };

    return through(write, end);
  };
};
