# 6to5ify

[6to5](https://github.com/6to5/6to5) [browserify](https://github.com/substack/node-browserify) plugin

## Installation

    $ npm install --save-dev 6to5ify

## Usage

### CLI

    $ browserify script.js -t 6to5ify --outfile bundle.js

### Node

```javascript
var fs = require("fs");
var browserify = require("browserify");
var to5ify = require("6to5ify");
browserify({ debug: true })
  .transform(to5ify)
  .require("./script.js", { entry: true })
  .bundle()
  .on("error", function (err) { console.log("Error : " + err.message); })
  .pipe(fs.createWriteStream("bundle.js"));
```

#### [Options](https://6to5.github.io/usage.html#options)

```javascript
browserify().transform(to5ify.configure({
  blacklist: ["generators"]
}))
```

```sh
$ browserify -d -e script.js -t [ 6to5ify --blacklist generators ]
```

#### Customising extensions

By default all files with the extensions `.js`, `.es`, '`.es6` and `.jsx` are compiled.
You can change this by passing an array of extensions.

**NOTE:** This will override the default ones so if you want to use any of them
you have to add them back.

```javascript
browserify().transform(to5ify.configure({
  extensions: [".6to5"]
}))
```

```sh
$ browserify -d -e script.js -t [ 6to5ify --extensions .6to5 ]
```

#### Relative source maps

Browserify passes an absolute path so there's no way to determine what folder
it's relative to. You can pass a relative path that'll be removed from the
absolute path with the `sourceMapRelative` option.

```javascript
browserify().transform(to5ify.configure({
  sourceMapRelative: "/Users/sebastian/Projects/my-cool-website/assets"
}))
```

```sh
$ browserify -d -e script.js -t [ 6to5ify --sourceMapRelative . ]
```

#### Additional options

```javascript
browserify().transform(to5ify.configure({
  // Optional ignore regex - if any filenames **do** match this regex then they
  // aren't compiled
  ignore: /regex/,

  // Optional only regex - if any filenames **don't** match this regex then they
  // aren't compiled
  only: /my_es6_folder/
}))
```

```sh
$ browserify -d -e script.js -t [ 6to5ify --ignore regex --only my_es6_folder ]
```
