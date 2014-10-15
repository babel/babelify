# 6to5-browserify

[6to5](https://github.com/sebmck/6to5) [browserify](https://github.com/substack/node-browserify) plugin

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
  .on("error", function(err) {console.log("Error : " + err.message);})
  .pipe(fs.createWriteStream("bundle.js"));
```

#### [Options](https://github.com/sebmck/6to5#options)

```javascript
browserify().transform(to5Browserify.configure({
  blacklist: ["generators"]
}))
```

#### Ignoring files

```javascript
browserify().transform(to5Browserify.configure({
  ignore: /\.js/
}))
```
