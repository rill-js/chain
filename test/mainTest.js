var assert = require("assert");
var chain  = require("../");

describe("Chain", function () {
	it("should work", function (done) {
		var result     = [];
		var middleware = [
			function first (ctx, next) {
				result.push(1);
				next();
				result.push(6);
			},
			function second (ctx, next) {
				result.push(2);
				next();
				result.push(5);
			},
			function third (ctx, next) {
				result.push(3);
				next();
				result.push(4);
			}
		];

		var fn = chain(middleware);

		fn()
			.then(function () { assert.deepEqual(result, [1, 2, 3, 4, 5, 6]); })
			.then(done)
			.catch(done);
	});

	it("should stop the chain without calling next", function (done) {
		var result     = [];
		var middleware = [
			function first (ctx, next) {
				result.push(1);
				next();
				result.push(6);
			},
			function second (ctx, next) {
				result.push(2);
			},
			function third (ctx, next) {
				result.push(3);
				next();
				result.push(4);
			}
		];

		var fn = chain(middleware);

		fn()
			.then(function () { assert.deepEqual(result, [1, 2, 6]); })
			.then(done)
			.catch(done);
	});
});