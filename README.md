<h1 align="center">
  <!-- Logo -->
  <img src="https://raw.githubusercontent.com/rill-js/rill/master/Rill-Icon.jpg" alt="Rill"/>
  <br/>
  @rill/chain
	<br/>

  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-stable-brightgreen.svg" alt="API Stability"/>
  </a>
  <!-- TypeScript -->
  <a href="http://typescriptlang.org">
    <img src="https://img.shields.io/badge/%3C%2F%3E-typescript-blue.svg" alt="TypeScript"/>
  </a>
  <!-- Prettier -->
  <a href="https://github.com/prettier/prettier">
    <img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg" alt="Styled with prettier"/>
  </a>
  <!-- Travis build -->
  <a href="https://travis-ci.org/rill-js/@rill/chain">
  <img src="https://img.shields.io/travis/rill-js/@rill/chain.svg" alt="Build status"/>
  </a>
  <!-- Coveralls coverage -->
  <a href="https://coveralls.io/github/rill-js/@rill/chain">
    <img src="https://img.shields.io/coveralls/rill-js/@rill/chain.svg" alt="Test Coverage"/>
  </a>
  <!-- NPM version -->
  <a href="https://npmjs.org/package/@rill/chain">
    <img src="https://img.shields.io/npm/v/@rill/chain.svg" alt="NPM Version"/>
  </a>
  <!-- Downloads -->
  <a href="https://npmjs.org/package/@rill/chain">
    <img src="https://img.shields.io/npm/dm/@rill/chain.svg" alt="Downloads"/>
  </a>
  <!-- Size -->
  <a href="https://npmjs.org/package/@rill/chain">
    <img src="https://img.shields.io/badge/size-766b-green.svg" alt="Browser Bundle Size"/>
  </a>
</h1>

This module is used internally by Rill but is extracted for convenience.
Composes all functions and Rill apps provided into a valid middleware function that returns a promise.

# Installation

```console
npm install @rill/chain
```

# Example

```javascript
import chain from "@rill/chain";

const stack = [];

// Regular functions that return anything
// but they will be resolved as promises.
stack.push((ctx, next)=> {
  return Promise.resolve(true);
})

// Async/await functions
stack.push(async (ctx, next)=> {
  await Promise.resolve(true);
});

// Other apps.
const app = new Rill();
app.use(...);
stack.push(app);

// Compose it into a function (returns a promise).
const fn = chain(stack)

// Call the function with a context.
fn({}).catch((err)=> {
  console.error(err.stack);
  process.exit(1);
});
```

### Contributions

* Use `npm test` to run tests.

Please feel free to create a PR!
