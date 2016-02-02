// sets up native
import bridge from '../bridge'
import { readFileSync } from 'fs'

export default {
  init() {
    bridge.onMessage('flint:getApp', () => {
      console.log('rfs is ', readFileSync)
      const flintJS = readFileSync('../../dist/flint.js')
      console.log('flintjs is', flintJS)
      bridge.broadcast('flint:sendApp', { src: flintJS })
    })
  }
}
