import * as extend from "just-extend";
import * as T from "./_types";

/**
 * Chain a stack of rill middleware into one composed function.
 */
export default function chain(stack: T.Stack) {
  if (!Array.isArray(stack)) {
    throw new TypeError("Rill: Middleware stack must be an array.");
  }

  const fns: T.MiddlewareFunction[] = normalize(stack, []);

  return (ctx?: any, next?: T.NextFunction) => {
    let index = -1; // Last called middleware.
    return dispatch(0);
    function dispatch(i: number): Promise<any> {
      if (i <= index) {
        return Promise.reject(new Error("Rill: next() called multiple times."));
      }

      const fn = fns[i] || next;
      index = i;

      try {
        return Promise.resolve(fn && fn(ctx, () => dispatch(i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}

/**
 * Utility to normalize a middleware stack and check for validity.
 * @internal
 */
function normalize(
  stack: T.Stack,
  fns: T.MiddlewareFunction[]
): T.MiddlewareFunction[] {
  for (const fn of stack) {
    if (!fn) {
      continue;
    }

    if (typeof fn === "function") {
      fns.push(fn);
    } else if (Array.isArray(fn)) {
      normalize(fn, fns);
    } else if (Array.isArray((fn as any).stack)) {
      normalize((fn as any).stack, fns);
    } else {
      throw new TypeError(
        "Rill: Invalid middleware provided. Got a [" +
          (fn.constructor as any).name +
          "]."
      );
    }
  }

  return fns;
}

module.exports = extend(exports.default, exports);
