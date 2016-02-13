var makeConf = require('./webpack.base');

module.exports = makeConf({
  externals: {
    react: 'React',
    'react-dom': 'null',
    'reapp-object-assign': 'null',
    'whatwg-fetch': 'null',
  },
  name: 'native',
  env: 'development',
  minify: false,
  target: 'node',
  output: {
    library: "Flint",
    libraryTarget: 'var',
  }
})
