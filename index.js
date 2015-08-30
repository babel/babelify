var assign = require("object-assign");
var stream = require("stream");
var babel  = require("babel-core");
var path   = require("path");
var util   = require("util");

module.exports = Babelify;
util.inherits(Babelify, stream.Transform);

function Babelify(filename, opts) {
  if (!(this instanceof Babelify)) {
    return Babelify.configure(opts)(filename);
  }

  stream.Transform.call(this);
  this._data = "";
  this._opts = assign({filename: filename}, opts);
}

Babelify.prototype._transform = function (buf, enc, callback) {
  this._data += buf;
  callback();
};

Babelify.prototype._flush = function (callback) {
  try {
    var code = babel.transform(this._data, this._opts).code;
    this.push(code);
  } catch(err) {
    this.emit("error", err);
    return;
  }
  callback();
};

Babelify.configure = function (opts) {
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

    return new Babelify(filename, opts);
  };
};
