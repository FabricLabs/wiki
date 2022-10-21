# Developers
Use `npm i -g @fabric/wiki` to install the `fabric-wiki` command to your path.

## Node.js
```js
const settings = {};
const Wiki = require('@fabric/wiki');
const wiki = new Wiki({ ...settings });
await wiki.start();
```
