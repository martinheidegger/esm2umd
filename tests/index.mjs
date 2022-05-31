import assert from "assert";
import util from "util";
import * as index from "../index.mjs";

console.log(`# ESM`);
console.log(index.default.filename);
assert(typeof index, "object");
assert(typeof index.default, "function");
console.log(util.inspect(index, { showHidden: true }));
