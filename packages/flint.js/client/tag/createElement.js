import native from './createElement.native'
import web from './createElement.web'

const isNative = false
export default isNative ? native : web
