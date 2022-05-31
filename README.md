esm2umd
=======

> Fork of [esm2umd](https://github.com/dcodeIO/esm2umd), namespaces under `@leichtgewicht`
> that transforms all .mjs files found in a folder to .cjs files and makes sure that they
> run in older node versions by replacing the package name inside the files.

Transforms ESM to UMD, i.e. to use ESM by default with UMD as a legacy fallback.

[![Build Status](https://img.shields.io/github/workflow/status/dcodeIO/esm2umd/Test/main?label=test&logo=github)](https://github.com/dcodeIO/esm2umd/actions?query=workflow%3ATest) [![Publish Status](https://img.shields.io/github/workflow/status/dcodeIO/esm2umd/Publish/main?label=publish&logo=github)](https://github.com/dcodeIO/esm2umd/actions?query=workflow%3APublish) [![npm](https://img.shields.io/npm/v/esm2umd.svg?label=npm&color=007acc&logo=npm)](https://www.npmjs.com/package/esm2umd)

Usage
-----

```
npx @leichtgewicht/esm2umd MyModule
```

`MyModule` is used as the name of the vanilla JS global.

If the module has a `default` export, it becomes the value obtained when `require`d.

API
---

Installation as a dependency is optional (pulls in megabytes of babel), but if so desired exposes the CLI as an API:

```js
import esm2umd from 'esm2umd'

const esmCode = '...'
const umdCode = esm2umd('ModuleName', esmCode)
```

Example
-------

ESM-first hybrid module with legacy fallback and prepublish build step.

**package.json**

```json
{
  "type": "module",
  "main": "./umd/index.js",
  "types": "index.d.ts",
  "exports": {
    "import": "./index.js",
    "require": "./umd/index.js"
  },
  "scripts": {
    "build": "npx esm2umd MyModule",
    "prepublishOnly": "npm run build"
  }
}
```

Treat .js files in `umd/` as CommonJS.

**umd/package.json**

```json
{
  "type": "commonjs"
}
```

Keep the generated artifact out of version control to avoid PRs against it.

**.gitignore**

```
umd/index.js
```

For typings, if there is a `default` export, stick to the "old" format for compatibility.

**index.d.ts**

```ts
export = MyModule;
```

Filename
--------

`__filename` is not available in es modules while the `import.meta.url` is not available
in common js modules. Since older Node.js versions do not support URL's in `fs` operations
the easiest way to work with `fs` operations is to use in node.js specific code.

The `__filename` equivalent in es modules is:

```js
import path from 'path'

const filename = decodeURI(import.meta.url).replace(/^file:\/\/(\/(\w+:))?/, '$2').replace(/\//g, path.sep);
```

`@leichtgewicht/esm2umd` will automatically replace the above string to `const filename = __filename`
in umd modules.

**Why is this so long?**

Now, you might be wondering why the filename is soo complicated, so lets explain all parts here.

1. `import.meta.url` contains a URL and spaces (and other special characters) are escaped like `/my%20folder/`
    `decodeURI(...)` will replace the encodings.
2. `import.meta.url` prefixes the path with `file://` but on windows it will also prefix an additional
    `/` before the `C:/...`. In the regexp `^file:\/\/(\/(\w+:))?` the second part `(\/(\w+:))?` will
    only match on windows¥ and put the `C:` in the `$2` variable. So the `.replace(..., '$2')` call will
    remove the `file://` prefix on *nix and if there is a `C:` on windows, it will also replace the
    unnecessary `/`.
3. `import.meta.url` is normalized for the `/` prefix but the `__filename` on windows is separated using
    the `\` character. To have consistent behavior `.replace(/\//g, path.sep)` will do nothing on *nix,
    but on windows it will make sure that the `/` is replaced by `\`.

