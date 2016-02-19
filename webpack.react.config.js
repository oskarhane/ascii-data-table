module.exports = {
  entry: './src/entry-react.jsx',
  output: {
    filename: 'lib/bundle-react.js'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      query: {
        presets: ['react', 'es2015']
      }
    }]
  }
}
