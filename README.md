[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Chat about Rill at https://gitter.im/rill-js/rill](https://badges.gitter.im/rill-js/rill.svg)](https://gitter.im/rill-js/rill?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# Chain

Composes all functions provided into a valid Rill middleware that returns a promise.

# Installation

#### Npm
```console
npm install @rill/chain
```

# Example

```javascript
var chain = require('@rill/chain');

var stack = [];

// regular functions that return anything
// but they will be resolved as promises.
stack.push(function (ctx, next) {
  return Promise.resolve(true);
});

// async/await functions
stack.push(async function (ctx, next) {
  await Promise.resolve(true);
});

// compose it into a function
var fn = chain(stack);

// this function returns a promise
fn({}).catch(function (err) {
  console.error(err.stack);
  process.exit(1);
})
```

### Contributions

* Use `npm test` to run tests.

Please feel free to create a PR!
