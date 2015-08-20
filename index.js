var assign = require("object-assign");
var stream = require("stream");
var babel  = require("babel-core");
var path   = require("path");

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
      return stream.PassThrough();
    }

    if (sourceMapRelative) {
      filename = path.relative(sourceMapRelative, filename);
    }

    var s = new stream.Transform();

    var data = "";

    s._transform = function (buf, enc, callback) {
      data += buf;
      callback();
    };

    s._flush = function (callback) {
      opts.filename = filename;
      try {
        this.push(babel.transform(data, opts).code);
      } catch(err) {
        this.emit("error", err);
        return;
      }
      callback();
    };

    return s;
  };
};
