import * as assert from "assert";
import chain from "../src";

describe("Chain", () => {
  it("should work", () => {
    const result = [];
    const middleware = [
      function first(ctx, next) {
        result.push(1);
        next();
        result.push(6);
      },
      function second(ctx, next) {
        result.push(2);
        next();
        result.push(5);
      },
      function third(ctx, next) {
        result.push(3);
        next();
        result.push(4);
      }
    ];

    return chain(middleware)().then(() => {
      assert.deepEqual(result, [1, 2, 3, 4, 5, 6]);
    });
  });

  it("should stop the chain without calling next", () => {
    const result = [];
    const middleware = [
      function first(ctx, next) {
        result.push(1);
        next();
        result.push(6);
      },
      function second(ctx, next) {
        result.push(2);
      },
      function third(ctx, next) {
        result.push(3);
        next();
        result.push(4);
      }
    ];

    return chain(middleware)().then(() => {
      assert.deepEqual(result, [1, 2, 6]);
    });
  });

  it("should ignore false and nullish values", () => {
    const result = [];
    const middleware = [
      function first(ctx, next) {
        result.push(1);
        next();
        result.push(6);
      },
      false,
      function second(ctx, next) {
        result.push(2);
        next();
        result.push(5);
      },
      function third(ctx, next) {
        result.push(3);
        next();
        result.push(4);
      },
      null
    ];

    return chain(middleware)().then(() => {
      assert.deepEqual(result, [1, 2, 3, 4, 5, 6]);
    });
  });

  it("should concat an object with a stack.", () => {
    const result = [];
    const app = {
      stack: [
        function first(ctx, next) {
          result.push(1);
          next();
          result.push(8);
        },
        function second(ctx, next) {
          result.push(2);
          next();
          result.push(7);
        },
        function third(ctx, next) {
          result.push(3);
          next();
          result.push(6);
        }
      ]
    };

    const middleware = [
      app,
      function fourth(ctx, next) {
        result.push(4);
        next();
        result.push(5);
      }
    ];

    return chain(middleware)().then(() => {
      assert.deepEqual(result, [1, 2, 3, 4, 5, 6, 7, 8]);
    });
  });

  it("should flatten arrays of middleware.", () => {
    const result = [];
    const middleware = [
      [
        function first(ctx, next) {
          result.push(1);
          next();
          result.push(8);
        },
        [
          function second(ctx, next) {
            result.push(2);
            next();
            result.push(7);
          },
          [
            function third(ctx, next) {
              result.push(3);
              next();
              result.push(6);
            },
            function fourth(ctx, next) {
              result.push(4);
              next();
              result.push(5);
            }
          ]
        ]
      ]
    ];

    return chain(middleware)().then(() => {
      assert.deepEqual(result, [1, 2, 3, 4, 5, 6, 7, 8]);
    });
  });

  it("should error with anything else", () => {
    assert.throws(chain.bind(null, [new Date()]), TypeError);
    assert.throws(chain.bind(null, [1]), TypeError);
    assert.throws(chain.bind(null, ["hello"]), TypeError);
    assert.throws(chain.bind(null, "hello"), TypeError);
  });

  it("should error when calling next multiple times.", () => {
    const middleware = [
      function first(ctx, next) {
        next();
        return next();
      }
    ];

    return chain(middleware)()
      .then(() => {
        assert.fail("Should have errored");
      })
      .catch(err => {
        assert.equal(err.message, "Rill: next() called multiple times.");
      });
  });

  it("should capture sync errors", () => {
    const middleware = [
      function first() {
        throw new Error("Failed");
      }
    ];

    return chain(middleware)()
      .then(() => {
        assert.fail("Should have errored");
      })
      .catch(err => {
        assert.equal(err.message, "Failed");
      });
  });
});
