import os from 'node:os'
import path from 'node:path'

function getCarapaceSpecsDir(): string {
  const homeDir = os.homedir()
  
  switch (os.platform()) {
    case 'darwin':
      return path.join(homeDir, 'Library/Application Support/carapace/specs')
    case 'win32':
      // Windows uses AppData/Local or the XDG_CONFIG_HOME equivalent
      const localAppData = (globalThis as any).process?.env?.LOCALAPPDATA || path.join(homeDir, 'AppData/Local')
      return path.join(localAppData, 'carapace/specs')
    default:
      // Linux and other Unix-like systems use XDG Base Directory specification
      const configHome = (globalThis as any).process?.env?.XDG_CONFIG_HOME || path.join(homeDir, '.config')
      return path.join(configHome, 'carapace/specs')
  }
}

export const CARAPACE_SPECS_DIR = getCarapaceSpecsDir()