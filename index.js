module.exports = chain;

function chain (fns) {
	return function chainedMiddleware (req, res, next) {
		next = next || noop;

		for (var fn, i = fns.length; i--;) {
			next = bind(fns[i], this, req, res, next);
		}

		return next();
	}
}

function bind (fn, ctx, req, res, next) {
	// Set the name of the next middleware for easier debugging.
	Object.defineProperty(nextMiddleware, "name", { value: fn.name || "next" });

	function nextMiddleware () {
		return Promise
			// Convert all functions to promises.
			.resolve(fn.call(ctx, req, res, next))
			// We chain a noop so that the return values of middleware is not passed around.
			.then(noop);
	};

	return nextMiddleware;
}

function noop () { return Promise.resolve(); }