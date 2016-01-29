import Surge from 'surge'
import hooks from './hooks'
import { build } from '../runner'
import name from './lib/appName'
import version from './lib/flintVersion'

build({
  name,
  version,
  keepAlive: true
}).then(res => {
  var surge = Surge({})
  surge.publish(hooks)({})
})