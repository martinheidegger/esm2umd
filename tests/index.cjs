const assert = require("assert");
const util = require("util");
const index = require("../index.js");

console.log("# CommonJS");
console.log(index.filename);
assert.equal(typeof index, "function");
console.log(util.inspect(index, { showHidden: true }));
