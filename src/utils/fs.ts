import fs from 'node:fs/promises'
import os from 'node:os'
import nodePath from 'node:path'

/**
 * Check path exists
 */
async function pathExists(path: string) {
  try {
    await fs.access(cleanPath(path))
    return true
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') {
      return false
    }
    throw error
  }
}

/**
 * - file not exists: returns undefined
 */
export async function inputFile(
  path: ReadFileArgs[0],
  options?: ReadFileArgs[1],
) {
  try {
    return await fs.readFile(cleanPath(path), options)
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') {
      return
    }
    throw error
  }
}

/**
 * - Auto create missing dirs
 */
async function outputFile(
  rawPath: WriteFileArgs[0],
  data: WriteFileArgs[1],
  options?: WriteFileArgs[2],
) {
  const path = cleanPath(rawPath)
  if (typeof path === 'string') {
    const dir = nodePath.dirname(path)
    await fs.mkdir(dir, { recursive: true })
  }
  return fs.writeFile(path, data, options)
}

// TODO
// emptyDir: readdirSync(dir).forEach(v => fs.rmSync(`${dir}/${v}`, { recursive: true })

/**
 * Walk dir
 */

async function* walk(rawDir: string): AsyncGenerator<string> {
  const dir = cleanPath(rawDir)
  for await (const d of await fs.opendir(dir)) {
    const entry = nodePath.join(dir, d.name)
    if (d.isDirectory()) yield* walk(entry)
    else if (d.isFile()) yield entry
  }
}

/**
 * - uses inputFile
 */
async function inputJson(input: ReadFileArgs[0], options?: ReadFileArgs[1]) {
  const text = (await inputFile(cleanPath(input), options || 'utf8')) as
    | string
    | undefined
  if (!text) {
    return
  }
  try {
    return JSON.parse(text)
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`[inputJson] ${error.message} from '${input}'`)
    }
    throw error
  }
}

/*
 * - uses readFile
 */
async function readJson(input: ReadFileArgs[0], options?: ReadFileArgs[1]) {
  const text = (await fs.readFile(
    cleanPath(input),
    options || 'utf8',
  )) as string
  try {
    return JSON.parse(text)
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`[readJson] ${error.message} from '${input}'`)
    }
    throw error
  }
}

/**
 * isSymlink
 */
async function isSymlink(input: PathLike) {
  const stat = await lstatSafe(input)
  return stat ? stat.isSymbolicLink() : false
}

/**
 * isFile
 */
async function isFile(input: PathLike) {
  const stat = await lstatSafe(input)
  return stat ? stat.isFile() : false
}

/**
 * isDir
 */
async function isDir(input: PathLike) {
  const stat = await lstatSafe(input)
  return stat ? stat.isDirectory() : false
}

/**
 * TS check if error is a Node Error
 */
function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && 'code' in error
}

// ignore ENOENT
async function lstatSafe(input: PathLike) {
  try {
    return await fs.lstat(cleanPath(input))
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') {
      return
    }
    throw error
  }
}

/**
 * Expands a file path that starts with '~' to the absolute path of the home directory.
 * @param {string} path - The file path to expand.
 * @returns {string} - The expanded absolute file path.
 */
export function expand(path: any) {
  if (!path || typeof path !== 'string') {
    return path
  }
  const home = os.homedir()
  if (path === '~') {
    return home
  }
  if (path.startsWith('~/') || path.startsWith('~\\')) {
    return nodePath.join(os.homedir(), path.slice(2))
  }
  return path
}

export function removeTrailingSlash(path: any) {
  if (!path || typeof path !== 'string') {
    return path
  }
  return path.replace(/[\\/]+$/, '')
}

export function cleanPath(path: any) {
  return removeTrailingSlash(expand(path))
}

async function remove(path: PathLike) {
  return fs.rm(cleanPath(path), { recursive: true, force: true })
}

async function copy() {
  throw new Error('NotImplmeented')
}

async function move(rawSrc: PathLike, rawDest: PathLike) {
  const src = cleanPath(rawSrc)
  const dest = cleanPath(rawDest)
  await makeMissingDirs(dest)
  return fs.rename(src, dest)
}

async function makeMissingDirs(rawPath: PathLike) {
  if (typeof rawPath !== 'string') {
    return
  }
  const path = cleanPath(rawPath)
  const parent = nodePath.dirname(path)
  return mkdirp(parent)
}

async function mkdirp(path: PathLike) {
  return fs.mkdir(path, { recursive: true })
}

type WriteFileArgs = Parameters<typeof fs.writeFile>
type ReadFileArgs = Parameters<typeof fs.readFile>
type PathLike = Parameters<typeof fs.lstat>[0]

export default {
  ...fs,
  pathExists,
  expand,
  cleanPath,
  inputFile,
  outputFile,
  isNodeError,
  readJson,
  inputJson,
  walk,
  isFile,
  isDir,
  isSymlink,
  remove,
  copy,
  move,
  mkdirp,
}
