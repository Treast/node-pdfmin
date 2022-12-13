const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

/** @type {import('webpack').Configuration} */
module.exports = {
  entry: './index.ts',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.min.js',
  },
  target: 'node',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: false,
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [new UglifyJsPlugin()],
  },
};
