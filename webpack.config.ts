import { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import 'webpack-dev-server';

const configuration: Configuration = {
  entry: './src/main.tsx',
  mode: 'development',
  resolve: {
    plugins: [
      new TsconfigPathsPlugin(),
    ],
    extensions: [
      '.ts',
      '.tsx',
      '.js',
    ],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
      },
      {
        test: /\.tsx$/,
        loader: 'ts-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.(ttf|woff|woff2)$/,
        use: {
          loader: 'url-loader',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './assets/html/index.html',
      favicon: './assets/favicon.ico',
    }),
  ],
  devServer: {
    client: {
      logging: 'warn',
    },
  },
};

export default configuration;
