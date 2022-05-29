#!/usr/bin/env node
import fs from 'fs'
import esm2umd from '../index.mjs'
import process from 'process'
import { pathToFileURL } from 'url'
import { sep, join, relative } from 'path'

if (process.argv[2] === '--help') {
  console.error("Usage: esm2umd [<ModuleName>]")
  process.exit(1)
}

async function toUMD (dirname, pkg, base) {
  const files = await fs.promises.readdir(dirname)
  const moduleMatch = new RegExp(`^(${pkg.name}\\/|\\.)`)
  for (const file of files) {
    const source = new URL(file, dirname)
    const stat = await fs.promises.stat(source)
    if (stat.isDirectory()) {
      if (file === 'node_modules' || file.startsWith('.')) {
        continue
      }
      await toUMD(
        new URL(source.href + sep), pkg, base === '.' ? '..' : base + sep + '..'
      )
    }
    if (!file.endsWith('.mjs')) {
      continue
    }
    if (source.href === import.meta.url) {
      continue
    }
    const name = file.replace(/\.mjs$/, '')
    const target = new URL(`${name}.js`, dirname)
    const esmFile = await fs.promises.readFile(source)
    let data = esm2umd(process.argv[2], esmFile, { importInterop: 'node' })
    data = data.replace(
      /(require\s*\(\s*["'])([^'"]+)\.mjs(["']\s*\))/g,
      (found, prefix, module, suffix) => {
        return moduleMatch.test(module) ? `${prefix}${module}.js${suffix}` : found
      }
    )
    await fs.promises.writeFile(target, data)
  }
}

;(async () => {
  const dirname = pathToFileURL(process.cwd() + sep)
  const jsonPath = join(dirname.pathname, 'package.json')
  const pkg = JSON.parse(await fs.promises.readFile(jsonPath, 'utf-8'))
  await toUMD(dirname, pkg, '.')
})()
  .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
