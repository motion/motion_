var makeConf = require('./webpack.base');

module.exports = makeConf({
  externals: {
    react: 'react-native',
    'react-dom': 'null',
    'flint-radium': 'null',
    'reapp-object-assign': 'null',
    'whatwg-fetch': 'null',
  },
  name: 'dev',
  env: 'development',
  minify: false,
  libraryTarget: 'umd',
  target: 'node',
})
