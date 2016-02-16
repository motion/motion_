var _exec = require('child_process').exec
var uid = process.getuid()

export default function exec(cmd, cwd, cb) {
  return _exec(cmd, { uid, cwd }, cb)
}
