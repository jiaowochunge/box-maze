const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

const config = require('./webpack.config.js')

module.exports = merge.smart(config, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    open: true,
    port: 8088
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development'
    }),
    new CopyPlugin([
      {
        from: 'node_modules/react/umd/react.development.js',
        to: 'vendor/react.js',
        cache: true
      },
      {
        from: 'node_modules/react-dom/umd/react-dom.development.js',
        to: 'vendor/react-dom.js',
        cache: true
      }
    ])
  ],
  module: {
    rules: [
      {
        // BUG: 不加type这个域无法使用file-loader加载json https://github.com/webpack/webpack/issues/6586
        type: 'javascript/auto',
        test: /\.json$/,
        include: /src\/assets/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        }
      }
    ]
  }
})
