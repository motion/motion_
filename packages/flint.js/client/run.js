import native from './run.native'
import web from './run.web'

export default global.isNative ? native : web
