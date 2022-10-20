const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  target: 'web',
  // mode: 'production',
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    assetModuleFilename: '[name][ext]'
  },
  devServer: {
    port: 9000,
    open: true,
    compress: true,
    hot: true,
    static: {
      directory: path.join(__dirname, 'dist')
    }
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      // {
      //   test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
      //   type: 'assets/resource'
      // }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      title: 'My webpage',
      filename: 'index.html',
      template: 'src/index.html'
    })
  ]
}