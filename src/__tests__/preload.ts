import { afterEach, jest, mock } from 'bun:test'
import memfs, { vol } from 'memfs'

mock.module('node:fs/promises', () => ({
  ...memfs.fs.promises,
  default: memfs.fs.promises,
}))

mock.module('#/utils/logger', () => ({
  logger: {
    log: jest.fn(),
  },
}))

afterEach(() => {
  vol.reset()
  jest.restoreAllMocks()
})
