import assert from "assert";
import util from "util";
import * as index from "../index.mjs";

console.log("# ESM");
assert(typeof index, "object");
assert(typeof index.default, "function");
console.log(util.inspect(index, { showHidden: true }));
