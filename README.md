# 6to5-browserify

[6to5](https://github.com/sebmck/6to5) [browserify](https://github.com/substack/node-browserify) plugin

## Installation

    $ npm install -g 6to5-browserify

## Usage

### CLI

    $ browserify script.js -t 6to5-browserify --outfile bundle.js

### Node

```javascript
var to5 = require("6to5-browserify");
browserify()
  .transform(to5Browserify)
  .require("script.js", { entry: true })
  .bundle({ debug: true })
  .pipe(fs.createWriteStream("bundle.js"));
```
