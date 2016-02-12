module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'lib/bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  }
}
