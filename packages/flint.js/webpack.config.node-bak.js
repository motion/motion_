var makeConf = require('./webpack.base');

module.exports = makeConf({
  native: true,
  name: 'node',
  entry: { flint: './client/flint' },
  outputPath: '/Users/nickc/company/platforms',
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
