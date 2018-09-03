var stream = require("stream");
var util   = require("util");
var path   = require("path");

let babel;
try {
  babel = require("@babel/core");
} catch (err) {
  if (err.code === "MODULE_NOT_FOUND") {
    err.message +=
      "\n babelify@9 requires Babel 7.x (the package '@babel/core'). " +
      "If you'd like to use Babel 6.x ('babel-core'), you should install 'babel-loader@7'.";
  }
  throw err;
}

// Since we've got the reverse bridge package at @babel/core@6.x, give
// people useful feedback if they try to use it alongside babel-loader.
if (/^6\./.test(babel.version)) {
  throw new Error(
    "\n babel-loader@8 will not work with the '@babel/core@6' bridge package. " +
      "If you want to use Babel 6.x, install 'babel-loader@7'.",
  );
}

module.exports = Babelify;
util.inherits(Babelify, stream.Transform);

function Babelify(filename, opts) {
  if (!(this instanceof Babelify)) {
    return Babelify.configure(opts)(filename);
  }

  stream.Transform.call(this);
  this._data = "";
  this._filename = filename;
  this._opts = Object.assign({filename: filename}, opts);
}

Babelify.prototype._transform = function (buf, enc, callback) {
  this._data += buf;
  callback();
};

Babelify.prototype._flush = function (callback) {
  babel.transform(this._data, this._opts, (err, result) => {
    if (err) {
      this.emit("error", err);
    } else {
      this.emit("babelify", result, this._filename);
      var code = result !== null ? result.code : this._data;
      this.push(code);
      callback();
    }
  });
};

Babelify.configure = function (opts) {
  opts = Object.assign({}, opts);
  var extensions = opts.extensions || babel.DEFAULT_EXTENSIONS;
  var sourceMapsAbsolute = opts.sourceMapsAbsolute;
  if (opts.sourceMaps !== false) opts.sourceMaps = "inline";

  // babelify specific options
  delete opts.sourceMapsAbsolute;
  delete opts.extensions;
  delete opts.filename;

  // babelify backwards-compat
  delete opts.sourceMapRelative;

  // browserify specific options
  delete opts._flags;
  delete opts.basedir;
  delete opts.global;

  // browserify cli options
  delete opts._;
  // "--opt [ a b ]" and "--opt a --opt b" are allowed:
  if (opts.ignore && opts.ignore._) opts.ignore = opts.ignore._;
  if (opts.only && opts.only._) opts.only = opts.only._;
  if (opts.plugins && opts.plugins._) opts.plugins = opts.plugins._;
  if (opts.presets && opts.presets._) opts.presets = opts.presets._;

  return function (filename, topts) {
    var extname = path.extname(filename);
    if (extensions.indexOf(extname) === -1) {
      return stream.PassThrough();
    }

    var _opts = sourceMapsAbsolute
      ? Object.assign({sourceFileName: filename}, opts)
      : opts;

    if (topts && topts._flags && topts._flags.basedir) _opts.cwd = topts._flags.basedir;

    return new Babelify(filename, _opts);
  };
};
