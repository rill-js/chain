<h1 align="center">
  <!-- Logo -->
  <img src="https://raw.githubusercontent.com/rill-js/rill/master/Rill-Icon.jpg" alt="Rill"/>
  <br/>
  @rill/chain
	<br/>

  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-stable-brightgreen.svg?style=flat-square" alt="API stability"/>
  </a>
  <!-- Standard -->
  <a href="https://github.com/feross/standard">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square" alt="Standard"/>
  </a>
  <!-- NPM version -->
  <a href="https://npmjs.org/package/@rill/chain">
    <img src="https://img.shields.io/npm/v/@rill/chain.svg?style=flat-square" alt="NPM version"/>
  </a>
  <!-- Downloads -->
  <a href="https://npmjs.org/package/@rill/chain">
    <img src="https://img.shields.io/npm/dm/@rill/chain.svg?style=flat-square" alt="Downloads"/>
  </a>
  <!-- Gitter Chat -->
  <a href="https://gitter.im/rill-js/rill">
    <img src="https://img.shields.io/gitter/room/rill-js/rill.svg?style=flat-square" alt="Gitter Chat"/>
  </a>
</h1>

Composes all functions and Rill apps provided into a valid middleware function that returns a promise.

# Installation

```console
npm install @rill/chain
```

# Example

```javascript
var chain = require('@rill/chain')

var stack = []

// regular functions that return anything
// but they will be resolved as promises.
stack.push((ctx, next)=> {
  return Promise.resolve(true)
})

// async/await functions
stack.push(async (ctx, next)=> {
  await Promise.resolve(true);
})

// Other apps.
const app = require('rill')()
app.use(...)
stack.push(app)

// compose it into a function
var fn = chain(stack)

// this function returns a promise
fn({}).catch((err)=> {
  console.error(err.stack)
  process.exit(1)
})
```

### Contributions

* Use `npm test` to run tests.

Please feel free to create a PR!
