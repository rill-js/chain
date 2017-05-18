'use strict'
module.exports = chain

/**
 * Chain a stack of rill middleware into one composed function.
 *
 * @param {Array<Function>}
 * @return {Function}
 */
function chain (stack) {
  if (!Array.isArray(stack)) throw new TypeError('Rill: Middleware stack must be an array.')
  var fns = normalize(stack, [])

  return function chained (ctx, next) {
    var index = -1 // Last called middleware.
    return dispatch(0)
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('Rill: next() called multiple times.'))

      var fn = fns[i] || next
      index = i

      if (!fn) {
        return Promise.resolve()
      }

      try {
        return Promise.resolve(fn(ctx, function next () {
          return dispatch(i + 1)
        }))
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}

/**
 * Utility to normalize a middleware stack and check for validity.
 *
 * @param {Array<Function>}
 * @throws {TypeError}
 */
function normalize (stack, fns) {
  var fn
  var len = stack.length
  for (var i = 0; i < len; i++) {
    fn = stack[i]
    if (!fn) continue
    else if (typeof fn === 'function') fns.push(fn)
    else if (Array.isArray(fn)) normalize(fn, fns)
    else if (Array.isArray(fn.stack)) normalize(fn.stack, fns)
    else throw new TypeError('Rill: Invalid middleware provided. Got a [' + fn.constructor.name + '].')
  }

  return fns
}
