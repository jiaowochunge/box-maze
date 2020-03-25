const webpack = require('webpack')
const merge = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const config = require('./webpack.config.js')

module.exports = merge.smart(config, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production'
    }),
    new CopyPlugin([
      {
        from: 'node_modules/react/umd/react.production.min.js',
        to: 'vendor/react.js'
      },
      {
        from: 'node_modules/react-dom/umd/react-dom.production.min.js',
        to: 'vendor/react-dom.js'
      }
    ])
  ]
})
