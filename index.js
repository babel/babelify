var stream = require("stream");
var babel  = require("babel-core");
var util   = require("util");
var path   = require("path")

module.exports = Babelify;
util.inherits(Babelify, stream.Transform);

function Babelify(filename, opts) {
  opts = Object.assign({}, opts)
  if (!(this instanceof Babelify)) {
    return Babelify.configure(opts)(filename);
  }

  stream.Transform.call(this);
  this._data = "";
  this._filename = filename;
  this._babel = opts.babel || babel
  delete opts.babel
  this._opts = Object.assign({filename: filename}, opts);
}

Babelify.prototype._transform = function (buf, enc, callback) {
  this._data += buf;
  callback();
};

// TODO - replace with semver when babel 7 release
Babelify.prototype._validateBabelVersion = function () {
  var split = this._babel.version.split('-')
  var version = split[0]
  if (parseInt(version[0]) < 7) return false
  if (!split[1]) return true
  var splitBeta = split[1].split('.')
  if (splitBeta.length === 2 && parseInt(splitBeta[1]) >= 32) return true
  return false
}

Babelify.prototype._handleTransformResult = function (result) {
  this.emit("babelify", result, this._filename);
  var code = result.code;
  this.push(code);
}

Babelify.prototype._handleTransformError = function (err) {
  if (err) this.emit("error", err);
}

Babelify.prototype._flush = function (callback) {
  if (this._validateBabelVersion()) {
    var self = this;
    this._babel.transform(this._data, this._opts, (err, result) => {
      err
        ? self._handleTransformError(err)
        : self._handleTransformResult(result);
      callback();
    });
    return
  }
  try {
    var result = this._babel.transform(this._data, this._opts)
    this._handleTransformResult(result)
  } catch(err) {
    this._handleTransformError(err)
    return;
  }
  callback();
};

Babelify.configure = function (opts) {
  opts = Object.assign({}, opts);
  var extensions = opts.extensions 
    ? [].concat(opts.extensions)
    : babel.DEFAULT_EXTENSIONS || [ ".js", ".jsx", ".es6", ".es", ".babel" ];
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

  return function (filename) {
    var extname = path.extname(filename)
    if (extensions.indexOf(extname) === -1) {
      return stream.PassThrough();
    }

    var _opts = sourceMapsAbsolute
      ? Object.assign({sourceFileName: filename}, opts)
      : opts;

    return new Babelify(filename, _opts);
  };
};
