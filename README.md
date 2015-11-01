# babelify

[Babel](https://github.com/babel/babel) [browserify](https://github.com/substack/node-browserify) transform

[![Build Status](https://travis-ci.org/babel/babelify.svg?branch=master)](https://travis-ci.org/babel/babelify)

## Installation

    $ npm install --save-dev babelify

## Usage

### CLI

    $ browserify script.js -t babelify --outfile bundle.js

### Node

```javascript
var fs = require("fs");
var browserify = require("browserify");
var babelify = require("babelify");
browserify("./script.js", { debug: true })
  .transform(babelify)
  .bundle()
  .on("error", function (err) { console.log("Error : " + err.message); })
  .pipe(fs.createWriteStream("bundle.js"));
```

#### [Options](https://babeljs.io/docs/usage/options)

Selected options are discussed below. See the [babel docs](https://babeljs.io/docs/usage/options) for the complete list.

```javascript
browserify().transform(babelify.configure({
  presets: ["es2015"]
}))
```

```sh
$ browserify -d -e script.js -t [ babelify --presets es2015 ]
```

Presets need to be installed as a separate module. For example, the above would need `babel-preset-es2015` installed from NPM.

#### Customising extensions

By default all files with the extensions `.js`, `.es`, `.es6` and `.jsx` are compiled.
You can change this by passing an array of extensions.

**NOTE:** This will override the default ones so if you want to use any of them
you have to add them back.

**NOTE:** Browserify only finds required `.js` and `.json` files by default. You will
also need to add the `--extension=.ext` option to browserify in order to `require()`
or `import` these files without specifying the extension. For example, to have
`require('./script')` in a browserified file resolve to a `./script.babel` file, you'd
need to configure browserify to also look for the `.babel` extension.
See the [`extensions` option](https://github.com/substack/node-browserify#browserifyfiles--opts) documentation.

```javascript
browserify({ extensions: [".babel"] }).transform(babelify.configure({
  extensions: [".babel"]
}))
```

```sh
$ browserify -d -e script.js --extensions=.babel -t [ babelify --extensions .babel ]
```

#### Relative source maps

Browserify passes an absolute path so there's no way to determine what folder
it's relative to. You can pass a relative path that'll be removed from the
absolute path with the `sourceMapRelative` option.

```javascript
browserify().transform(babelify.configure({
  sourceMapRelative: "/Users/sebastian/Projects/my-cool-website/assets"
}))
```

```sh
$ browserify -d -e script.js -t [ babelify --sourceMapRelative . ]
```

#### Additional options

```javascript
browserify().transform(babelify.configure({
  // Optional ignore regex - if any filenames **do** match this regex then they
  // aren't compiled
  ignore: /regex/,

  // Optional only regex - if any filenames **don't** match this regex then they
  // aren't compiled
  only: /my_es6_folder/
}))
```

```sh
$ browserify -d -e script.js -t [ babelify --ignore regex --only my_es6_folder ]
```

#### Babel result: metadata and others

Babelify emits a `babelify` event with Babel's full result object as the first
argument, and the filename as the second. Browserify doesn't pass-through the
events emitted by a transform, so it's necessary to get a reference to the
transform instance before you can attach a listener for the event:

```js
var b = browserify().transform(babelify);

b.on('transform', function(tr) {
  if (tr instanceof babelify) {
    tr.once('babelify', function(result, filename) {
      result; // => { code, map, ast, metadata }
    });
  }
});
```

## FAQ

### Why aren't files in `node_modules` being transformed?

This is default browserify behaviour and **can not** be overriden. A possible solution is to add:

```json
{
  "browserify": {
    "transform": ["babelify"]
  }
}
```

to the root of all your modules `package.json` that you want to be transformed. If you'd like to
specify options then you can use:

```json
{
  "browserify": {
    "transform": [["babelify", { "presets": ["es2015"] }]]
  }
}
```
