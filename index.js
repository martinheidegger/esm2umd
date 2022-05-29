// GENERATED FILE. DO NOT EDIT.
var esm2umd = (function(exports) {
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = esm2umd;
  
  var _core = require("@babel/core");
  
  var _pluginTransformModulesCommonjs = require("@babel/plugin-transform-modules-commonjs");
  
  const wrapper = `// GENERATED FILE. DO NOT EDIT.
  var %NAME% = (function(exports) {
    %CODE%
    return "default" in exports ? exports.default : exports;
  })({});
  if (typeof define === 'function' && define.amd) define([], function() { return %NAME%; });
  else if (typeof module === 'object' && typeof exports==='object') module.exports = %NAME%;
  `;
  
  function esm2umd(moduleName, esmCode, options = {}) {
    if (!options.importInterop) options.noInterop = true;
  
    const umdCode = _core.transform(esmCode, {
      plugins: [[_pluginTransformModulesCommonjs, options]]
    }).code.trim().replace(/new URL\(import\.meta\.url\)\.pathname/g, '__filename');
  
    if (moduleName) {
      return wrapper.replace(/%NAME%/g, moduleName).replace("%CODE%", umdCode.replace(/\n/g, "\n  ").trimRight());
    }
  
    return umdCode;
  }
  return "default" in exports ? exports.default : exports;
})({});
if (typeof define === 'function' && define.amd) define([], function() { return esm2umd; });
else if (typeof module === 'object' && typeof exports==='object') module.exports = esm2umd;
