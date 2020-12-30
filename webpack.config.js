const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = (_, argv) => ({
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath:
      argv.mode === "development"
        ? "http://localhost:8081/"
        : "https://prod-test-consumer.herokuapp.com/",
    filename: '[name].[chunkhash].js'
  },

  resolve: {
    extensions: [".jsx", ".js", ".json"],
  },

  devServer: {
    port: 8081,
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "consumer",
      filename: "remoteEntry.js",
      remotes: {
        header: `header@${argv.mode === "development"
        ? "http://localhost:8080"
        : "https://prod-test-consumer.herokuapp.com"}/remoteEntry.js`,
      },
      exposes: {},
      shared: require("./package.json").dependencies,
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
});
