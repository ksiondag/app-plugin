# App-Plugin

Plugin a webapp into a parent app.

## Quick Start

```javascript
const express = require('express');
const app = express();
const appPlugin = require('app-plugin');

appPlugin.add(app, '/', 'https://github.com/ksiondag/exampleStaticApp.git');
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
app.use('/', router);
```

Though it will also work with any repository that is an npm-package that
provides an app if given the express module (more on that below in Dyanmic
Webapps).

## Rules

The webapp plugin needs to be a valid path to a git repository. Local repos
will work.

### Static Webapps

The root directory of the git repo needs to have an index.html.

### Dynamic Webapps

These are apps that use express apps themselves and have a server component.

These need to have a proper package.json with all actual requirements saved.

`require(<webapp>)` must return a function that takes an express app as its one
and only argument.

