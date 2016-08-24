var assert = require('assert')
var chain = require('../')

describe('Chain', function () {
  it('should work', function (done) {
    var result = []
    var middleware = [
      function first (ctx, next) {
        result.push(1)
        next()
        result.push(6)
      },
      function second (ctx, next) {
        result.push(2)
        next()
        result.push(5)
      },
      function third (ctx, next) {
        result.push(3)
        next()
        result.push(4)
      }
    ]

    var fn = chain(middleware)

    fn()
      .then(function () { assert.deepEqual(result, [1, 2, 3, 4, 5, 6]) })
      .then(done)
      .catch(done)
  })

  it('should stop the chain without calling next', function (done) {
    var result = []
    var middleware = [
      function first (ctx, next) {
        result.push(1)
        next()
        result.push(6)
      },
      function second (ctx, next) {
        result.push(2)
      },
      function third (ctx, next) {
        result.push(3)
        next()
        result.push(4)
      }
    ]

    var fn = chain(middleware)

    fn()
      .then(function () { assert.deepEqual(result, [1, 2, 6]) })
      .then(done)
      .catch(done)
  })

  it('should ignore falsey values', function (done) {
    var result = []
    var middleware = [
      function first (ctx, next) {
        result.push(1)
        next()
        result.push(6)
      },
      false,
      function second (ctx, next) {
        result.push(2)
        next()
        result.push(5)
      },
      0,
      function third (ctx, next) {
        result.push(3)
        next()
        result.push(4)
      },
      null
    ]

    var fn = chain(middleware)

    fn()
      .then(function () { assert.deepEqual(result, [1, 2, 3, 4, 5, 6]) })
      .then(done)
      .catch(done)
  })

  it('should concat an object with a stack.', function (done) {
    var result = []
    var app = {
      stack: [
        function first (ctx, next) {
          result.push(1)
          next()
          result.push(8)
        },
        function second (ctx, next) {
          result.push(2)
          next()
          result.push(7)
        },
        function third (ctx, next) {
          result.push(3)
          next()
          result.push(6)
        }
      ]
    }

    var middleware = [app, function fourth (ctx, next) {
      result.push(4)
      next()
      result.push(5)
    }]

    var fn = chain(middleware)

    fn()
      .then(function () { assert.deepEqual(result, [1, 2, 3, 4, 5, 6, 7, 8]) })
      .then(done)
      .catch(done)
  })

  it('should flatten arrays of middleware.', function (done) {
    var result = []
    var middleware = [
      [
        function first (ctx, next) {
          result.push(1)
          next()
          result.push(8)
        },
        [
          function second (ctx, next) {
            result.push(2)
            next()
            result.push(7)
          },
          [
            function third (ctx, next) {
              result.push(3)
              next()
              result.push(6)
            },
            function fourth (ctx, next) {
              result.push(4)
              next()
              result.push(5)
            }
          ]
        ]
      ]
    ]

    var fn = chain(middleware)

    fn()
      .then(function () { assert.deepEqual(result, [1, 2, 3, 4, 5, 6, 7, 8]) })
      .then(done)
      .catch(done)
  })

  it('should error with anything else', function () {
    assert.throws(chain.bind(null, [new Date()]), TypeError)
    assert.throws(chain.bind(null, [1]), TypeError)
    assert.throws(chain.bind(null, ['hello']), TypeError)
    assert.throws(chain.bind(null, 'hello'), TypeError)
  })
})
