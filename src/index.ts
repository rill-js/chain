// Support commonjs
module.exports = exports = chain;

// Expose Types.
export namespace Types {
  export type NextFunction = () => Promise<any>;
  export type MiddlewareFunction<T = any> = (
    ctx: T,
    next?: NextFunction
  ) => any;
  export type MiddlewareArg<T = any> =
    | MiddlewareFunction<T>
    | { stack: Stack<T>; [x: string]: any }
    | boolean
    | void;

  export interface Stack<T = any> extends Array<MiddlewareArg<T> | Stack<T>> {
    [index: number]: MiddlewareArg<T> | Stack<T>;
  }
}

/**
 * Chain a stack of rill middleware into one composed function.
 *
 * @param stack An array of middleware arguments to convert to a function.
 */
export default function chain<T = any>(stack: Types.Stack<T>) {
  if (!Array.isArray(stack)) {
    throw new TypeError("Rill: Middleware stack must be an array.");
  }

  const fns: Types.MiddlewareFunction<T>[] = normalize(stack, []);

  return (ctx: T, next?: Types.NextFunction) => {
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
 * Utility to (recursively) normalize a middleware stack and check for validity.
 * @param stack An array of middleware arguments to convert to a function.
 * @param fns The current list of normalized middleware functions.
 * @internal
 */
function normalize<T = any>(
  stack: Types.Stack<T>,
  fns: Types.MiddlewareFunction<T>[]
) {
  for (const fn of stack) {
    if (!fn) {
      continue;
    }

    if (typeof fn === "function") {
      fns.push(fn as Types.MiddlewareFunction<T>);
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
