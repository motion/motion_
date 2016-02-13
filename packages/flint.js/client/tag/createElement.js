import native from './createElement.native'
import web from './createElement.web'

export default isNative ? native : web
