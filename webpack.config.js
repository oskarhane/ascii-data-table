module.exports = {
  entry: './src/entry.js',
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
