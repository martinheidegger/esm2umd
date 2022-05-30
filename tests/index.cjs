const assert = require("assert");
const util = require("util");

console.log("# CommonJS");
const index = require("../index.js");
assert.equal(typeof index, "function");
console.log(util.inspect(index, { showHidden: true }));
