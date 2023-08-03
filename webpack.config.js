const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    token_db: './assets/javascript/token_db.ts',
    device: './assets/javascript/device.ts',
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      "fs": false,
      "buffer": require.resolve("buffer")
    },
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './static/kpro_app/js'),
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    })
  ]
};