# 6to5-browserify

[6to5](https://github.com/6to5/6to5) [browserify](https://github.com/substack/node-browserify) plugin

## Installation

    $ npm install -g 6to5-browserify

## Usage

### CLI

    $ browserify script.js -t 6to5-browserify --outfile bundle.js

### Node

```javascript
var fs = require("fs");
var browserify = require("browserify");
var to5Browserify = require("6to5-browserify");
browserify({ debug: true })
  .transform(to5Browserify)
  .require("./script.js", { entry: true })
  .bundle()
  .on("error", function (err) { console.log("Error : " + err.message); })
  .pipe(fs.createWriteStream("bundle.js"));
```

#### [Options](https://6to5.github.io/usage.html#options)

```javascript
browserify().transform(to5Browserify.configure({
  blacklist: ["generators"]
}))
```

#### Customising extensions

By default all files with the extensions `.js`, `.es6` and `.jsx` are compiled.
You can change this by passing an array of extensions.

**NOTE:** This will override the default ones so if you want to use any of them
you have to add them back.

```javascript
browserify().transform(to5Browserify.configure({
  extensions: [".6to5"]
}))
```

#### Additional options

```javascript
browserify().transform(to5Browserify.configure({
  // Optional ignore regex - if any filenames **do** match this regex then they
  // aren't compiled
  ignore: /regex/,

  // Optional only regex - if any filenames **don't** match this regex then they
  // aren't compiled
  only: /my_es6_folder/
}))
```
