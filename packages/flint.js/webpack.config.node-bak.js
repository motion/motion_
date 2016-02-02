var makeConf = require('./webpack.base');

module.exports = makeConf({
  native: true,
  name: 'node',
  entry: { flint: './client/flint' },
  outputPath: '/Users/nickc/tests/ios-kittens/.flint/.internal/out',
  minify: false,
  env: 'dev',
  target: 'node',
  libraryTarget: 'umd',
  externals: {
    react: 'require("react-native")',
    'react-dom': 'null',
    'flint-radium': 'null',
  },
})
