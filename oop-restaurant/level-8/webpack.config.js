// webpack.config.js

module.exports = {
  entry: __dirname + '/src/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },{
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },{
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader'
      },{ 
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: [
          {
            loader: 'url-loader',
            query: {
              limit: 20000,
              name: 'img/[name]-[hash:5].[ext]'
            }
          }, {
            loader: 'image-webpack-loader'
          }
        ]
      }
    ]
  }
}