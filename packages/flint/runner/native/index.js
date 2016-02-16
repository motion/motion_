import { readFile, copy, writeFile,
         p, exists, handleError, mkdir } from '../lib/fns'
import exec from '../lib/exec'
import opts from '../opts'

const currentPath = p(__dirname, '..', 'runner', 'native')
function createCmd() {
  const packager = p(currentPath, 'app_base', 'node_modules', 'react-native', 'local-cli', 'cli.js')

  const flintJSDist = '/Users/nickc/flint/packages/flint.js/dist'
  const appOut = p(opts('internalDir'), 'out')
  const internal = p(opts('flintDir'), '')
  const roots = [p(opts('flintDir')), flintJSDist]
   ///Users/nickc/flint/packages/flint.js/dist,/Users/nickc/company/native/basic/.flint,/Users/nickc/company/native/basic/.flint/.internal/out
  return `node ${packager} start --blacklistRE="" --projectRoots=${roots.join(',')}`
}

export default new class {
  constructor() {
  }

  async prepare() {
    try {
      const iosIndex = p(opts('flintDir'), 'index.ios.js')
      try {
        await exists(iosIndex)
      } catch (e) {
        if (e.code === 'ENOENT') {
          const iosFolder = p(opts('flintDir'), 'ios')
          await mkdir(iosFolder)
          console.log('Copying iOS Assets');
          await copy(p(currentPath, 'react-native'), iosFolder)
          await copy(p(currentPath, 'scaffold.ios.js'), iosIndex)
          console.log('Installing React Native');
          await exec(`npm install --save react-native`, opts('flintDir'))
        }
      }

      const cmd = createCmd()
      console.log('running command', cmd);
      //exec(cmd)
      const Packager = exec(cmd)
      Packager.stdout.on('data', (data) => {
        console.log(data);
      });

      Packager.stderr.on('data', (data) => {
        console.log('stderr: ' + data);
      });

      Packager.on('exit', (code) => {
        console.log('child process exited with code ' + code);
      });

      return
    } catch (e) { handleError(e) }
  }
}
