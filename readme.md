# App-Plugin

Plugin a webapp into a parent app.

## Quick Start

```javascript
const express = require('express');
const app = express();
const appPlugin = require('app-plugin');

appPlugin(express, 'https://github.com/ksiondag/exampleStaticApp.git', function (subapp) {
    app.use(subapp);
});
```

This is equivalent to:

```bash
#bash
git clone https://github.com/ksiondag/exampleStaticApp.git subapps/exampleStaticApp
```

```javascript
//javascript
const express = require('express');
const app = express();

const router = express.Router();
router.use('/', express.static('subapps/exampleStaticApp'));
app.use(router);
```

Though it will also work with any repository that is an npm-package that
provides an app if given the express module (more on that below in Dyanmic
Webapps).

## Rules

The webapp plugin needs to be a valid path to a git repository or a local
directory. Local repos will work, but will be cloned into static_apps area if
they are not also npm packages (those will be installed to cover depency
issues).

### Static Webapps

The root directory of the git repo needs to have an index.html.

### Dynamic Webapps

These are apps that use express apps themselves and have a server component.

These need to have a proper package.json with all actual requirements saved.

`require(<webapp>)` must return a function that takes the express module as its
only argument. This function will return an app, or call a callback with the
subapp as the first argument.

```javascript
const express = require('express');
const app = express();
const appPlugin = require('app-plugin');

appPlugin(express, 'https://github.com/ksiondag/exampleNpmApp.git', function (subapp) {
    app.use(subapp);
});
```
Is equivalent to:

```bash
#bash
npm install exampleNpmApp
```

```javascript
const express = require('express');
const app = express();

const pluginModule = require('exampleNpmApp');

subapp = pluginModule(express);
app.use(subapp);
```

Or (if async):

```javascript
const express = require('express');
const app = express();

const pluginModule = require('exampleNpmApp');

pluginModule(express, functino (subapp) {
    app.use(subapp);
});
```

