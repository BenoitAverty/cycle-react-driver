const join = require('path').join;

module.exports = {
  entry: {
    'bmi-example': './examples/bmi-example.js',

  },
  output: {
    path: join(__dirname, 'examples'),
    filename: '[name].dist.js',
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react'],
        },
      },
    ],
  },
};
