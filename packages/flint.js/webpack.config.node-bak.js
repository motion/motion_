var makeConf = require('./webpack.base');

module.exports = makeConf({
  name: 'node',
  entry: { flint: './client/flint' },
  outputPath: '/Users/nickc/code/AwesomeProject',
  minify: false,
  env: 'production',
  target: 'node',
  libraryTarget: 'umd'
})
