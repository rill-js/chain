module.exports = chain;

/**
 * Chain a stack of rill middleware into one composed function.
 *
 * @param {Array<Function>}
 * @return {Function}
 */
function chain (fns) {
	validate(fns);
	return function chained (ctx, next) {
		var index = -1; // Last called middleware.
		return dispatch(0);
		function dispatch (i) {
			if (i <= index) return Promise.reject(new Error("next() called multiple times"));

			index = i;
			fn    = fns[i] || next;

			if (!fn) return Promise.resolve();
			try {
				return Promise.resolve(fn(ctx, function next () { dispatch(i + 1); }));
			}
			catch (err) {
				return Promise.reject(err);
			}
		}
	}
}

/**
 * Utility to validate that a middleware stack is an array of functions.
 *
 * @param {Array<Function>}
 * @throws {TypeError}
 */
function validate (fns) {
	if (!Array.isArray(fns))
		throw new TypeError("Middleware stack must be an array!");

	for (var i = fns.length; i--;) {
		if (typeof fns[i] !== "function")
			throw new TypeError("Middleware must be composed of functions!");
	}
}