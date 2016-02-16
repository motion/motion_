import native from './createElement.native'
import web from './createElement.web'

export default global.isNative ? native : web
