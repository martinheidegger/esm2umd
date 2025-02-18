#!/usr/bin/env node
import fs from 'fs'
import esm2umd from '../index.mjs'
import process from 'process'
import path from 'path'

if (process.argv[2] === '--help') {
  console.error("Usage: esm2umd [<ModuleName>]")
  process.exit(1)
}

const filename = decodeURI(import.meta.url).replace(/^file:\/\/(\/(\w+:))?/, '$2').replace(/\//g, path.sep)

async function toUMD (dirname, pkg) {
  const files = await fs.promises.readdir(dirname)
  const moduleMatch = new RegExp(`^(${pkg.name}\\/|\\.)`)
  for (const file of files) {
    const source = path.join(dirname, file)
    const stat = await fs.promises.stat(source)
    if (stat.isDirectory()) {
      if (file === 'node_modules' || file.startsWith('.')) {
        continue
      }
      await toUMD(source, pkg)
    }
    if (!file.endsWith('.mjs')) {
      continue
    }
    if (source === filename) {
      continue
    }
    const name = file.replace(/\.mjs$/, '')
    const target = path.join(dirname, `${name}.js`)
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
  const dirname = process.cwd()
  const pkg = JSON.parse(await fs.promises.readFile(path.join(dirname, 'package.json'), 'utf-8'))
  await toUMD(dirname, pkg)
})()
  .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
