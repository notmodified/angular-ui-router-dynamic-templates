module.exports = {
  entry: "./src/main.js",
  devtool: 'source-map',
  output: {
    filename: "./dist/bundle.js"
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: "style!css" },
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }

};
