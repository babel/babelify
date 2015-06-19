var through = require("through2");
var assign  = require("object-assign");
var babel   = require("babel-core");
var path    = require("path");
var crypto  = require("crypto");
var cache   = {};

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
      var cached, code, newHash;

      opts.filename = filename;
      try {
        cached = cache[filename];
        newHash = crypto.createHash("md5").update(data).digest("hex");

        if (cached && cached.hash == newHash){
          code = cached.code;
        }else{
          code = babel.transform(data, opts).code;
          cache[filename] = {
            code:code,
            hash : newHash
          }
        }

        this.push(code);

      } catch(err) {
        this.emit("error", err);
      }
      callback();
    };

    return through(write, end);
  };
};
