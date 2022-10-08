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
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './assets/html/index.html',
    }),
  ],
  devServer: {
    client: {
      logging: 'warn',
    },
  },
};

export default configuration;
