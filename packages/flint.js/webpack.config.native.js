var makeConf = require('./webpack.base');
module.exports = makeConf({
  externals: {
    react: 'require("react-native")',
    'react-dom': 'null',
    'flint-radium': 'null',
    'reapp-object-assign': 'null',
    'whatwg-fetch': 'null',
  },
  name: 'native',
  env: 'development',
  minify: false,
  target: 'node',
})
